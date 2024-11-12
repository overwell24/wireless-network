from flask import Blueprint, jsonify
from db import db
from models import Cafe, Location

api_bp = Blueprint('api', __name__, url_prefix='/api') 

@api_bp.route('/cafes', methods=['GET'])
def get_cafes():
    cafes = Cafe.query.all()
    cafe_list = [
        {
            "cafe_id": cafe.cafe_id,
            "cafe_name": cafe.cafe_name,
            "lat": cafe.location.lat,
            "lng": cafe.location.lng
        }
        for cafe in cafes
    ]
    return jsonify(cafe_list)

    

@api_bp.route('/cafes/<int:cafe_id>', methods=['GET'])
def get_cafe_by_id(cafe_id):
    pass

@api_bp.route('/cafe/table-status', methods=['POST'])
def update_table_status():
    pass