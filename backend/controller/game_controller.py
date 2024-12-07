from flask import make_response, jsonify, request
from engine.dynamo_client import DynamoClient
import hashlib
from engine.s3_client import S3Client
#from werkzeug.utils import secure_filename


class GameController:
    def __init__(self):
        self.table_name = "minirun_game_table"
        self.db_client = DynamoClient(table_name="minirun_game_table")
        self.s3_client = S3Client()  # S3専用クラスを利用

    def get_game_random(self):
        response = self.db_client.get_random()
        return make_response(jsonify({
            'code': 200,
            'game': response
        }))
    
    def get_last_id(self) -> int:
        response = self.db_client.scan(TableName=self.table_name, ProjectionExpression="id")
        items = response.get('Items', [])
        if not items:
            return 0
        ids = [int(item['id']['N']) for item in items]
        return max(ids)

    def create_quiz(self):
        # リクエストデータを取得
        data = request.get_json()
        question = data['question']
        selects = data['selects']
        answer_idx = data['answer_idx']
        last_id = self.get_last_id()
        data['id'] = last_id + 1

        # バリデーションを実装
        if not isinstance(question, str) or not question.strip():
            return make_response(jsonify({'code': 400, 'message': 'Invalid question'}), 400)
        if not isinstance(selects, list) or len(selects) != 4:
            return make_response(jsonify({'code': 400, 'message': 'Invalid selects'}), 400)
        if not isinstance(answer_idx, int) or not (0 <= answer_idx <= 3):
            return make_response(jsonify({'code': 400, 'message': 'Invalid answer_idx'}), 400)
        
        # DBに保存
        try:
            if self.db_client.create_quiz(data):
                return make_response(jsonify({'code': 200, 'message': 'Quiz created successfully'}), 200)
            else:
                return make_response(jsonify({'code': 500, 'message': 'Failed to create quiz'}), 500)
        except Exception as e:
            # エラーハンドリングを実装
            return make_response(jsonify({'code': 500, 'message': str(e)}), 500)
        
    def create_intro(self):
        data = request.get_json()
        music_title_answer = data['music_title_answer']
        #music_data = data['music_data'] # musicのデータ本体
        last_id = self.get_last_id()
        data['id'] = last_id + 1

        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        # ファイル名を安全にする
        #filename = secure_filename(file.filename)
        filename = file.filename
        # ファイル名のハッシュを生成
        file_hash = hashlib.sha256(filename.encode('utf-8')).hexdigest()

        try:
            # S3にファイルをアップロード
            upload_to_s3(file, file_hash, file.content_type)
            # DynamoDBにメタデータを保存
            self.db_client.save_file_metadata(data, file_hash, filename)
            return jsonify({"message": "File uploaded successfully", "file_hash": file_hash}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500


        # バリデーションを実装
        if not isinstance(music_title_answer, str) or not music_title_answer.strip():
            return make_response(jsonify({'code': 400, 'message': 'Invalid music_title_answer'}), 400)
        if not music_data:
            return make_response(jsonify({'code': 400, 'message': 'Invalid music_data'}), 400)

        # DBに保存
        try:
            if self.db_client.create_intro(data):
                return make_response(jsonify({'code': 200, 'message': 'Intro created successfully'}), 200)
            else:
                return make_response(jsonify({'code': 500, 'message': 'Failed to create intro'}), 500)
        except Exception as e:
            return make_response(jsonify({'code': 500, 'message': str(e)}), 500)

    def create_search_diff(self):
        try:
            # フォームデータとファイルを取得
            images = request.files.getlist('images')  # 画像ファイルのリスト
            answer_idx = request.form.get('answer_idx')  # 正解の番号(request.filesを操作した後にrequest.get_json()を使用するとエラーが発生する可能性があるらしい)

            # バリデーションチェック
            if not images or len(images) != 9:
                return make_response(jsonify({'code': 400, 'message': 'Invalid images list'}), 400)
            if answer_idx is None or not answer_idx.isdigit() or not (0 <= int(answer_idx) < 9):
                return make_response(jsonify({'code': 400, 'message': 'Invalid correct index'}), 400)

            answer_idx = int(answer_idx)

            # 画像ファイルをS3に保存
            image_hashes = []
            for image in images:
                #filename = secure_filename(image.filename)
                filename = image.filename
                file_hash = hashlib.sha256(filename.encode('utf-8')).hexdigest()
                # S3にアップロード
                self.s3_client.upload_fileobj(image, file_hash)
                image_hashes.append(file_hash)

            # DynamoDBに保存するデータを作成
            data_to_save = {
                'id': self.get_last_id() + 1,  # 新しいID
                'genre': 'search_diff',       # ジャンルを指定
                'image_hashes': image_hashes, # 画像ハッシュリスト
                'answer_idx': answer_idx      # 正解のインデックス
            }

            # データベースに保存
            if self.db_client.create_search_diff(data_to_save):
                return make_response(jsonify({'code': 200, 'message': 'Search diff created successfully'}), 200)
            else:
                return make_response(jsonify({'code': 500, 'message': 'Failed to create search diff'}), 500)
        except Exception as e:
            return make_response(jsonify({'code': 500, 'message': str(e)}), 500)
    
    
    def play_quiz(self):
        try:
            # データベースからランダムに問題を取得
            #response = self.db_client.get_random()
            response = self.db_client.get_random_2(genre="quiz")
            if response:
                quiz_data = {
                "question": response.get('question', {}).get('S', ''),
                "selects": [select.get('S', '') for select in response.get('selects', {}).get('L', [])],
                "answer_idx": int(response.get('answer_idx', {}).get('N', -1))
                }
                return make_response(jsonify({
                    'code': 200,
                    'game_content': quiz_data
                }), 200)
            else:
                return make_response(jsonify({
                    'code': 404,
                    'message': 'No quiz found'
                }), 404)
        except Exception as e:
            return make_response(jsonify({
                'code': 500,
                'message': str(e)
            }), 500)
        
    def play_intro(self):
        try:
            # データベースからランダムに問題を取得
            #response = self.db_client.get_random()
            response = self.db_client.get_random_2(genre="introdon")
            if response:
                intro_data = {
                "music_title_answer": response.get('music_title_answer', {}).get('S', ''),
                #"music_data": response.get('music_data', {}).get('B', '')
                }
                return make_response(jsonify({
                    'code': 200,
                    'game_content': intro_data
                }), 200)
            else:
                return make_response(jsonify({
                    'code': 404,
                    'message': 'No intro found'
                }), 404)
        except Exception as e:
            return make_response(jsonify({
                'code': 500,
                'message': str(e)
            }), 500)

    def play_search_diff(self):
        try:
            # データベースからランダムに問題を取得
            response = self.db_client.get_random_2(genre="search_diff")
            if response:
                # ハッシュ値リストを取得
                image_hashes = response.get("image_hashes", [])
                answer_idx = response.get("answer_idx", -1)
                # ハッシュ値を元にS3から画像データを取得
                image_data_list = []
                for image_hash in image_hashes:
                    try:
                        image_data = self.s3_client.get_s3_file_data(image_hash)
                        image_data_list.append(image_data)
                    except Exception as s3_error:
                        print(f"Error getting image data from S3: {e}")
                        return make_response(jsonify({
                            'code': 500,
                            'message': f"Failed to retrieve image for hash: {image_hash}"
                        }), 500)

                search_diff_data = {
                    "images": image_data_list,  # 画像データリスト
                    "answer_idx": answer_idx
                }
                return make_response(jsonify({
                    'code': 200,
                    'game_content': search_diff_data
                }), 200)
            else:
                return make_response(jsonify({
                    'code': 404,
                    'message': 'No search_diff found'
                }), 404)
        except Exception as e:
            return make_response(jsonify({
                'code': 500,
                'message': str(e)
            }), 500)
        

    def play_diffshot(self):
        try:
            # データベースからランダムに問題を取得
            response = self.db_client.get_random()
            if response:
                diffshot_data = {
                "picture_data": response.get('picture_data', {}).get('S', ''),
                "picture_data_answer": response.get('picture_data_answer', {}).get('S', ''),
                "answer_points": response.get('answer_points', {}).get('L', [])
                }
                return make_response(jsonify({
                    'code': 200,
                    'game_content': diffshot_data
                }), 200)
            else:
                return make_response(jsonify({
                    'code': 404,
                    'message': 'No diffshot found'
                }), 404)
        except Exception as e:
            return make_response(jsonify({
                'code': 500,
                'message': str(e)
            }), 500)