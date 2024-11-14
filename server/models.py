from db import db
from sqlalchemy.dialects.postgresql import JSON

# Location 테이블 정의
class Location(db.Model):
    __tablename__ = 'locations'
    id = db.Column(db.Integer, primary_key=True)  # 고유 id
    lat = db.Column(db.Float, nullable=False)  # 위도
    lng = db.Column(db.Float, nullable=False)  # 경도

    # Location 객체는 위도(lat)와 경도(lng)를 받아 초기화
    def __init__(self, lat, lng):
        self.lat = lat
        self.lng = lng

    # Location 객체를 생성하는 class method
    @classmethod
    def create(cls, lat, lng):
        # Location 객체 생성 후 DB에 추가
        location = cls(lat=lat, lng=lng)
        db.session.add(location)
        db.session.commit()
        return location

    # Location과 관련된 Cafe 목록을 조회하는 관계 설정
    cafes = db.relationship('Cafe', backref='location', lazy=True)

# Cafe 테이블 정의
class Cafe(db.Model):
    __tablename__ = 'cafes'
    cafe_id = db.Column(db.Integer, primary_key=True)  # 고유 cafe_id
    cafe_name = db.Column(db.String(100), nullable=False)  # 카페 이름 
    cafe_address = db.Column(db.String(100), nullable=False) # 카페 주소
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)  # Location과 연결되는 외래키

    # 테이블 상태를 저장할 JSON 컬럼 (예: 테이블 번호와 상태)
    tables_occupied_status = db.Column(JSON, nullable=False, default={})

    # Cafe 객체 초기화
    def __init__(self, cafe_name, cafe_address, location, num_tables=0):
        self.cafe_name = cafe_name
        self.cafe_address = cafe_address
        self.location = location
        self.tables_occupied_status = self._initialize_tables(num_tables)

    # Cafe 객체를 생성하는 class method
    @classmethod
    def create_with_location(cls, cafe_name, cafe_address, lat, lng, num_tables=0):
        # Location 객체를 먼저 생성
        location = Location.create(lat, lng)
        
        # Cafe 객체 생성
        new_cafe = cls(cafe_name=cafe_name, cafe_address=cafe_address, location=location, num_tables=num_tables)
        
        # Cafe 객체 DB에 저장
        db.session.add(new_cafe)
        db.session.commit()
        
        return new_cafe
    # 테이블 수에 맞는 초기 상태(JSON 구조) 생성
    def _initialize_tables(self, num_tables):
        return {f"table_{i+1}": 0 for i in range(num_tables)}  # 모든 테이블의 상태를 0(빈자리)으로 초기화

    # 특정 테이블의 상태를 업데이트하는 메서드
    def update_occupied_table_status(self, table_number, status):
        table_key = f"table_{table_number}"  # 테이블 번호로 키 생성
        self.tables_occupied_status[table_key] = status  # 상태 업데이트
        db.session.commit()  # 변경 사항 저장
