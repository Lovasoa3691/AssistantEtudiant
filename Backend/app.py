from flask import Flask
from config import Config
from models.models import db
from flask_cors import CORS
from routes.api import api_blueprint
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
CORS(app)

with app.app_context():
    db.create_all()

app.register_blueprint(api_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
