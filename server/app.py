from flask import Flask
from db import db  
from routers.api import api_bp
import os
import query_list 

def create_app():
    app = Flask(__name__)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{BASE_DIR}/instance/cafes.db"

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.register_blueprint(api_bp, url_prefix='/api')

     # 데이터베이스 초기화
    db.init_app(app)

    # 데이터베이스 테이블 생성
    with app.app_context():
        db.create_all()   
        # 카페와 위치를 한 번에 생성
        query_list.create_cafe()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)