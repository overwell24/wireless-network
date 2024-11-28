from flask import Blueprint, request
from services.cafe_service import CafeService
import json

api_bp = Blueprint('api', __name__, url_prefix='/api')

# 카페 리스트 반환
@api_bp.route('/cafes', methods=['GET', 'OPTIONS'])
def get_cafes():
    cafe_data_list = CafeService.get_all_cafes()
    return json.dumps(cafe_data_list, ensure_ascii=False)

# 특정 카페 반환
@api_bp.route('/cafes/<int:cafe_id>', methods=['GET', 'OPTIONS'])
def get_cafe_by_id(cafe_id):
    cafe_data = CafeService.get_cafe_by_id(cafe_id)
    if not cafe_data:
        return json.dumps({"error": "Cafe not found"}, ensure_ascii=False), 404
    return json.dumps(cafe_data, ensure_ascii=False)

# 특정 카페의 테이블 상태 조회
@api_bp.route('/cafes/<int:cafe_id>/tables', methods=['GET', 'OPTIONS'])
def get_table_occupied_status(cafe_id):
    table_status = CafeService.get_table_status(cafe_id)
    if table_status is None:
        return json.dumps({"error": "카페를 찾을 수 없습니다."}, ensure_ascii=False), 404
    return json.dumps(table_status, ensure_ascii=False)

# 특정 카페 테이블 상태 업데이트
@api_bp.route('/cafe/table-occupied-status', methods=['POST', 'OPTIONS'])
def update_table_occupied_status():
    data = request.get_json()
    cafe_id = data['cafe_id']
    table_statuses = {key: value for key, value in data.items() if key != 'cafe_id'}
    
    result = CafeService.update_table_status(cafe_id, table_statuses)
    if not result:
        return json.dumps({"error": "카페를 찾을 수 없습니다."}, ensure_ascii=False), 404
    
    return json.dumps({"message": "테이블 상태가 성공적으로 업데이트되었습니다."}, ensure_ascii=False), 200

@api_bp.after_request
def add_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; connect-src 'self' http://15.165.161.251"
    )
    return response