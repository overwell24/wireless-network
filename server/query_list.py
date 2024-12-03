from models import Cafe

def create_cafe():
    cafes = Cafe.query.all()

    if not cafes: 
        # 카페와 위치를 한 번에 생성
        Cafe.create_with_location(cafe_name="Inha University Cafe",cafe_address="인천광역시 미추홀구 인하로 100 인하공업전문대학 4호관 1층" ,lat=37.4504, lng=126.6540, num_tables=10)
        Cafe.create_with_location(cafe_name="Inha Technical College Cafe",cafe_address="인천광역시 미추홀구 인하로 100 인하공업전문대학 4호관 1층", lat=37.4563, lng=126.6523, num_tables=10)