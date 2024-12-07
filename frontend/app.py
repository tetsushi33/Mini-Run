from flask import Flask, render_template
from flask_cors import CORS


app = Flask(__name__)
# CORS(app,resources={r"/*":{"origins":"http://127.0.0.1:8030/"}})

CORS(app, resources={r"/*": {
    "origins": ["http://127.0.0.1:8030", "https://example.com"],
    "methods": ["GET", "POST"],
    "allow_headers": [r"*"]
}})


def viewPointMake(theme:str ,content:str):
    # app.make
    return (theme,content)



@app.route("/")
def site_start():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8120, debug=False)