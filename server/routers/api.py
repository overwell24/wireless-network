from flask import Blueprint,  request
from models import Cafe
import json

api_bp = Blueprint('api', __name__, url_prefix='/api') 

# 카페 목록 리스트 조회 
@api_bp.route('/cafes', methods=['GET'])
def get_cafes():
    cafes = Cafe.query.all()  # 모든 카페 조회
    cafe_data_list = [
        {
            "cafe_id": cafe.cafe_id,
            "cafe_name": cafe.cafe_name,
            "cafe_address": cafe.cafe_address,
            "lat": cafe.location.lat,
            "lng": cafe.location.lng
        }
        for cafe in cafes
    ]
    cafe_data_list_json = json.dumps(cafe_data_list, ensure_ascii=False)
    return cafe_data_list_json


# 특정 카페 조회 
@api_bp.route('/cafes/<int:cafe_id>', methods=['GET'])
def get_cafe_by_id(cafe_id):
    cafe = Cafe.query.get(cafe_id)  # 특정 cafe_id에 해당하는 카페 조회
    if not cafe:
        return json.dumps({"error": "Cafe not found"}, ensure_ascii=False), 404  # 카페가 없으면 404 응답
    
    cafe_data = {
        "cafe_id": cafe.cafe_id,
        "cafe_name": cafe.cafe_name,
        "cafe_address": cafe.cafe_address,
        "lat": cafe.location.lat,
        "lng": cafe.location.lng,
        "tables_occupied_status": cafe.tables_occupied_status  
    }

    cafe_data_json = json.dumps(cafe_data, ensure_ascii=False)
    return cafe_data_json

# 특정 카페의 테이블 상태를 실시간 조회
@api_bp.route('/cafes/<int:cafe_id>/tables', methods=['GET'])
def get_table_occupied_status(cafe_id):
    cafe = Cafe.query.get(cafe_id)  
    return json.dumps(cafe.tables_occupied_status, ensure_ascii=False)

# 테이블 상태 실시간 업데이트
@api_bp.route('/cafe/table-occupied-status', methods=['POST'])
def update_table_occupied_status():
    data = request.get_json()  # 요청 본문에서 JSON 데이터 가져오기

    # 필수 데이터 확인
    if not data or 'cafe_id' not in data:
        return json.dumps({"error": "cafe_id가 누락되었습니다."}, ensure_ascii=False), 404  # cafe_id 없으면 오류
    
    cafe_id = data['cafe_id']
    cafe = Cafe.query.get(cafe_id)  # cafe_id에 해당하는 카페 조회

    if not cafe:
        
        return json.dumps({"error": "카페를 찾을 수 없습니다."}, ensure_ascii=False), 404  # 카페가 없으면 오류

    # 테이블 상태 업데이트 (cafe_id를 제외한 모든 키가 테이블 번호)
    table_occupied_statuses = {key: value for key, value in data.items() if key != 'cafe_id'}

    # 각 테이블 상태 확인 및 업데이트
    for table_id, table_occupied_status in table_occupied_statuses.items():
        if not isinstance(table_occupied_status, int) or table_occupied_status not in [0, 1]:
            
            return json.dumps({"error": f"테이블 상태는 0 또는 1이어야 합니다. 잘못된 값: {table_occupied_status}"}, ensure_ascii=False), 404

        # 상태가 유효하면 테이블 상태 갱신
        cafe.update_occupied_table_status(table_id, table_occupied_status)

    return json.dumps({"message": "테이블 상태가 성공적으로 업데이트되었습니다."}, ensure_ascii=False), 200

