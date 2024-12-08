from flask import Flask
from flask_cors import CORS
import router
from config import config

def create_app():
    app = Flask(__name__)

    app.config.from_object(config.Config)

    app.register_blueprint(router.router)

    app.config['JSON_AS_ASCII'] = False #日本語文字化け対策
    app.config["JSON_SORT_KEYS"] = False #ソートをそのまま
    CORS(
        app,
        resources = {
            r"/api/*": {"origins": ["http://localhost", "http://localhost:3000"]}
        }
    )

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', debug=True, port=5001, threaded=True, use_reloader=False)