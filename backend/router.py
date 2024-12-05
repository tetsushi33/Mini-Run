from flask import Blueprint
from controller import game_controller
from logging import config
from json import load
import logger

# Generate Router Instance
router = Blueprint('router', __name__)

# Read Logging Configuration
with open("./config/logging.json", "r", encoding="utf-8") as f:
    config.dictConfig(load(f))

@router.route("/", methods=['GET'])
@logger.http_request_logging
def hello_world():
    return "Hello World!!"

@router.route("/api/play/random", methods=['GET'])
@logger.http_request_logging
def api_play_random():
    return game_controller.get_game_random()

@router.route("/api/create/quiz", methods=['POST'])
@logger.http_request_logging
def api_create_quiz():
    return game_controller.create_quiz()

@router.after_request
def after_request(response):
    # response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
