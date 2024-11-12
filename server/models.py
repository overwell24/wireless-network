from db import db

class Location(db.Model):
    __tablename__ = 'locations'
    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)

    # 관계 정의: cafes에 대한 역참조만 Location에서 정의
    cafes = db.relationship('Cafe', backref='location', uselist=False)

# 카페 정보를 저장하는 모델
class Cafe(db.Model):
    __tablename__ = 'cafes'
    cafe_id = db.Column(db.Integer, primary_key=True)
    cafe_name = db.Column(db.String(100), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)

