from flask import make_response, jsonify
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
        # TODO: バリデーションを実装
        if self.db_client.create_quiz():
            return make_response(jsonify({'code: 200'}))
        # TODO: エラーハンドリングを実装
