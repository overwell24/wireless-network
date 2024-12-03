import cv2
import numpy as np
from ultralytics import YOLO
import requests
import time
from threading import Thread
import json

def send_status_to_api(table1_status: int, table2_status: int):
    """API로 테이블 상태를 전송하는 함수"""
    api_url = "http://15.165.161.251/api/cafe/table-occupied-status"
    
    json_data = {
        "cafe_id": 1,
        "table_1": table1_status,
        "table_2": table2_status
    }
    
    try:
        print(f"\n>>> {api_url} 서버로 데이터 정보가 전송됨:")
        print(json.dumps(json_data, indent=2, ensure_ascii=False))
        
        response = requests.post(
            api_url,
            json=json_data,
            headers={"Content-Type": "application/json"}
        )
    except requests.exceptions.RequestException as e:
        print(f"API 전송 오류: {str(e)}")

def detect_people_occupancy():
    # YOLO 모델 로드
    model = YOLO('yolov8n.pt')
    
    # 웹캠 초기화
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: 웹캠을 열 수 없습니다")
        return
    
    last_send_time = time.time()
    
    def is_person_in_area(person_box, area):
        """박스가 지정된 영역과 겹치는지 확인"""
        px1, py1, px2, py2 = person_box
        ax1, ay1, ax2, ay2 = area
        
        center_x = (px1 + px2) / 2
        center_y = (py1 + py2) / 2
        
        return (ax1 <= center_x <= ax2) and (ay1 <= center_y <= ay2)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: 프레임을 읽을 수 없습니다")
            break
            
        frame_height, frame_width = frame.shape[:2]
        table1_area = [0, 0, frame_width//2, frame_height]
        table2_area = [frame_width//2, 0, frame_width, frame_height]
            
        # YOLO로 객체 감지
        results = model(frame, conf=0.5)
        
        table1_occupied = 0
        table2_occupied = 0
        
        # 감지된 객체 처리
        for r in results:
            boxes = r.boxes
            for box in boxes:
                if int(box.cls[0]) == 0:  # person class
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    
                    if is_person_in_area([x1, y1, x2, y2], table1_area):
                        table1_occupied = 1
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    elif is_person_in_area([x1, y1, x2, y2], table2_area):
                        table2_occupied = 1
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        # 테이블 영역 표시
        cv2.rectangle(frame, (table1_area[0], table1_area[1]), 
                     (table1_area[2], table1_area[3]), (255, 0, 0), 2)
        cv2.rectangle(frame, (table2_area[0], table2_area[1]), 
                     (table2_area[2], table2_area[3]), (255, 0, 0), 2)
        
        # 상태 텍스트 표시
        cv2.putText(frame, f"Table_1: {table1_occupied}", 
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                   (0, 255, 0) if table1_occupied else (0, 0, 255), 2)
        cv2.putText(frame, f"Table_2: {table2_occupied}", 
                   (frame_width//2 + 10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                   (0, 255, 0) if table2_occupied else (0, 0, 255), 2)
        
        # 1초마다 별도 스레드로 API 전송
        current_time = time.time()
        if current_time - last_send_time >= 1.0:
            Thread(target=send_status_to_api, 
                  args=(table1_occupied, table2_occupied)).start()
            last_send_time = current_time
        
        cv2.imshow('People Detection', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    detect_people_occupancy()