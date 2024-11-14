from flask import Blueprint, jsonify, request
from db import db
from models import Cafe, Location

api_bp = Blueprint('api', __name__, url_prefix='/api') 

# 카페 목록 조회
@api_bp.route('/cafes', methods=['GET'])
def get_cafes():
    cafes = Cafe.query.all()  # 모든 카페 조회
    cafe_list = [
        {
            "cafe_id": cafe.cafe_id,
            "cafe_name": cafe.cafe_name,
            "cafe_address": cafe.cafe_address,
            "lat": cafe.location.lat,
            "lng": cafe.location.lng
        }
        for cafe in cafes
    ]
    print(cafes[0].cafe_address)
    return jsonify(cafe_list)


# 카페 ID로 카페 조회
@api_bp.route('/cafes/<int:cafe_id>', methods=['GET'])
def get_cafe_by_id(cafe_id):
    cafe = Cafe.query.get(cafe_id)  # 특정 cafe_id에 해당하는 카페 조회
    if not cafe:
        return jsonify({"error": "Cafe not found"}), 404  # 카페가 없으면 404 응답
    
    cafe_data = {
        "cafe_id": cafe.cafe_id,
        "cafe_name": cafe.cafe_name,
        "cafe_address": cafe.cafe_address,
        "lat": cafe.location.lat,
        "lng": cafe.location.lng,
        "tables_occupied_status": cafe.tables_occupied_status  # 테이블 상태 포함
    }

    return jsonify(cafe_data)


# 테이블 상태 업데이트
@api_bp.route('/cafe/table-occupied-status', methods=['POST'])
def update_table_occupied_status():
    data = request.get_json()  # 요청 본문에서 JSON 데이터 가져오기

    # 필수 데이터 확인
    if not data or 'cafe_id' not in data:
        return jsonify({"error": "cafe_id가 누락되었습니다."}), 400  # cafe_id 없으면 오류
    
    cafe_id = data['cafe_id']
    cafe = Cafe.query.get(cafe_id)  # cafe_id에 해당하는 카페 조회

    if not cafe:
        return jsonify({"error": "카페를 찾을 수 없습니다."}), 404  # 카페가 없으면 오류

    # 테이블 상태 업데이트 (cafe_id를 제외한 모든 키가 테이블 번호)
    table_occupied_statuses = {key: value for key, value in data.items() if key != 'cafe_id'}

    # 각 테이블 상태 확인 및 업데이트
    for table_id, table_occupied_status in table_occupied_statuses.items():
        if not isinstance(table_occupied_status, int) or table_occupied_status not in [0, 1]:
            return jsonify({"error": f"테이블 상태는 0 또는 1이어야 합니다. 잘못된 값: {table_occupied_status}"}), 400

        # 상태가 유효하면 테이블 상태 갱신
        cafe.update_occupied_table_status(table_id, table_occupied_status)

    return jsonify({"message": "테이블 상태가 성공적으로 업데이트되었습니다."}), 200
