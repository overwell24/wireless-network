from models import Cafe

class CafeService:
    @staticmethod
    def get_all_cafes():
        cafes = Cafe.query.all()
        return [
            {
                "cafe_id": cafe.cafe_id,
                "cafe_name": cafe.cafe_name,
                "cafe_address": cafe.cafe_address,
                "lat": cafe.location.lat,
                "lng": cafe.location.lng
            }
            for cafe in cafes
        ]

    @staticmethod
    def get_cafe_by_id(cafe_id):
        cafe = Cafe.query.get(cafe_id)
        if not cafe:
            return None
        return {
            "cafe_id": cafe.cafe_id,
            "cafe_name": cafe.cafe_name,
            "cafe_address": cafe.cafe_address,
            "lat": cafe.location.lat,
            "lng": cafe.location.lng,
            "tables_occupied_status": cafe.tables_occupied_status
        }

    @staticmethod
    def get_table_status(cafe_id):
        """특정 카페의 테이블 상태를 가져오는 메서드"""
        cafe = Cafe.query.get(cafe_id)
        if not cafe:
            return None  # 카페가 없으면 None 반환
        return cafe.tables_occupied_status  # 테이블 상태 반환

    @staticmethod
    def update_table_status(cafe_id, table_statuses):
        cafe = Cafe.query.get(cafe_id)
        if not cafe:
            return None
        for table_id, status in table_statuses.items():
            print(f"service: {table_id}: {status}")
            cafe.update_occupied_table_status(table_id, status)
        return True