from flask import Blueprint
from controller.game_controller import GameController
from logging import config
from json import load
import logger
import boto3

## クライアントの初期化
#s3_client = boto3.client(
#    "s3",
#    aws_access_key_id=S3_ACCESS_KEY,
#    aws_secret_access_key=S3_SECRET_KEY,
#    endpoint_url=S3_ENDPOINT,  # MinIOの場合
#)
#dynamodb = boto3.resource("dynamodb", region_name=REGION_NAME)
#dynamodb_table = dynamodb.Table(DYNAMODB_TABLE)

# Generate Router Instance
router = Blueprint('router', __name__)
controller = GameController()

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
    return controller.get_game_random()

@router.route("/api/create/quiz", methods=['POST'])
@logger.http_request_logging
def api_create_quiz():
    return controller.create_quiz()

@router.route("/api/create/intro", methods=['POST'])
@logger.http_request_logging
def api_create_intro():
    return controller.create_intro()

@router.route("/api/create/diffshot", methods=['POST'])
@logger.http_request_logging
def api_create_diffshot():
    return controller.create_diffshot()

@router.after_request
def after_request(response):
    # response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
