from flask import Blueprint, request
from services.cafe_service import CafeService
import json

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/cafes', methods=['GET'])
def get_cafes():
    cafe_data_list = CafeService.get_all_cafes()
    return json.dumps(cafe_data_list, ensure_ascii=False)

@api_bp.route('/cafes/<int:cafe_id>', methods=['GET'])
def get_cafe_by_id(cafe_id):
    cafe_data = CafeService.get_cafe_by_id(cafe_id)
    if not cafe_data:
        return json.dumps({"error": "Cafe not found"}, ensure_ascii=False), 404
    return json.dumps(cafe_data, ensure_ascii=False)

@api_bp.route('/cafe/table-occupied-status', methods=['POST'])
def update_table_occupied_status():
    data = request.get_json()
    if not data or 'cafe_id' not in data:
        return json.dumps({"error": "cafe_id가 누락되었습니다."}, ensure_ascii=False), 404
    
    cafe_id = data['cafe_id']
    table_statuses = {key: value for key, value in data.items() if key != 'cafe_id'}
    
    for table_id, status in table_statuses.items():
        if not isinstance(status, int) or status not in [0, 1]:
            return json.dumps({"error": f"테이블 상태는 0 또는 1이어야 합니다. 잘못된 값: {status}"}, ensure_ascii=False), 404
    
    result = CafeService.update_table_status(cafe_id, table_statuses)
    if not result:
        return json.dumps({"error": "카페를 찾을 수 없습니다."}, ensure_ascii=False), 404
    
    return json.dumps({"message": "테이블 상태가 성공적으로 업데이트되었습니다."}, ensure_ascii=False), 200

@api_bp.route('/cafes/<int:cafe_id>/tables', methods=['GET'])
def get_table_occupied_status(cafe_id):
    """특정 카페의 테이블 상태 조회"""
    table_status = CafeService.get_table_status(cafe_id)
    if table_status is None:
        return json.dumps({"error": "카페를 찾을 수 없습니다."}, ensure_ascii=False), 404
    return json.dumps(table_status, ensure_ascii=False)
