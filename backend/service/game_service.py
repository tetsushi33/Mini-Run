from flask import make_response, jsonify


def get_game_logic():
    game = Game.get_game_list()
    game_schema = GameSchema(many=True)
    return make_response(jsonify({
        'code': 200,
        'game': game
    }))
