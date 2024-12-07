from flask import make_response, jsonify, request
from engine.dynamo_client import DynamoClient

class GameController:
    def __init__(self):
        self.db_client = DynamoClient(table_name="game_table")

    def get_game_random(self):
        response = self.db_client.get_random()
        return make_response(jsonify({
            'code': 200,
            'game': response
        }))

    def create_quiz(self):
        # リクエストデータを取得
        data = request.get_json()
        question = data['questions']
        selects = data['selects']
        answer = data['answer']

        # バリデーションを実装
        if not data or 'quiz_name' not in data or 'questions' not in data:
            return make_response(jsonify({'code': 400, 'message': 'Invalid data'}), 400)

        if not isinstance(question, str) or not question.strip():
            return make_response(jsonify({'code': 400, 'message': 'Invalid question'}), 400)
        if not isinstance(selects, list) or len(selects) != 4:
            return make_response(jsonify({'code': 400, 'message': 'Invalid selects'}), 400)
        if not isinstance(answer, int) or not (0 <= answer <= 3):
            return make_response(jsonify({'code': 400, 'message': 'Invalid answer'}), 400)
        
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
        if not data or 'intro_name' not in data or 'intro_text' not in data:
            return make_response(jsonify({'code': 400, 'message': 'Invalid data'}), 400)
        
        try:
            if self.db_client.create_intro(data):
                return make_response(jsonify({'code': 200, 'message': 'Intro created successfully'}), 200)
            else:
                return make_response(jsonify({'code': 500, 'message': 'Failed to create intro'}), 500)
        except Exception as e:
            return make_response(jsonify({'code': 500, 'message': str(e)}), 500)
