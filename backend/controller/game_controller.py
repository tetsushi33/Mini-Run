from flask import make_response, jsonify, request
from engine.dynamo_client import DynamoClient
import hashlib
#from werkzeug.utils import secure_filename
#from dynamo_client import save_file_metadata
#from s3_client import upload_to_s3
#from dotenv import load_dotenv


class GameController:
    def __init__(self):
        self.table_name = "minirun_game_table"
        self.db_client = DynamoClient(table_name="minirun_game_table")

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
        id = 1 # データベースを見て次のidを取得する
        data['id'] = id

        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        # ファイル名を安全にする
        filename = secure_filename(file.filename)
        # ファイル名のハッシュを生成
        file_hash = hashlib.sha256(filename.encode('utf-8')).hexdigest()

        try:
            # S3にファイルをアップロード
            upload_to_s3(file, file_hash, file.content_type)
            # DynamoDBにメタデータを保存
            save_file_metadata(file_hash, filename)
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

    def create_diffshot(self):
        data = request.get_json()
        picture_data = data['picture_data']
        picture_data_answer = data['picture_data_answer']
        answer_points = data['answer_points']
        id = 1 # データベースを見て次のidを取得する
        data['id'] = id

        # バリデーションを実装
        if not isinstance(picture_data, str) or not music_title_answer.strip():
            return make_response(jsonify({'code': 400, 'message': 'Invalid music_title_answer'}), 400)
        if not music_data:
            return make_response(jsonify({'code': 400, 'message': 'Invalid music_data'}), 400)


        # DBに保存
        try:
            if self.db_client.create_diffshot(data):
                return make_response(jsonify({'code': 200, 'message': 'Diffshot created successfully'}), 200)
            else:
                return make_response(jsonify({'code': 500, 'message': 'Failed to create diffshot'}), 500)
        except Exception as e:
            return make_response(jsonify({'code': 500, 'message': str(e)}), 500)
            
    def play_quiz(self):
        try:
            # データベースからランダムに問題を取得
            response = self.db_client.get_random()
            if response:
                return make_response(jsonify({
                    'code': 200,
                    'game': response
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
