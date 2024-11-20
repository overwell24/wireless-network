#include <SoftwareSerial.h>

// SoftwareSerial 핀 설정 (RX, TX)
SoftwareSerial esp8266(0 , 1);

//WIFI 설정
String ssid = "ssid";          
String password = "password";  
//서버URL
String server = "server";  

// 압력 센서 핀 설정
const int PressSensor = A0;

void setup() {
  // 기본 시리얼 모니터 통신
  Serial.begin(9600);       
   // ESP8266 통신 
  esp8266.begin(115200);    

  // Wi-Fi 연결
  connectWiFi();             
        
}

void loop() {
  // 1초마다 센서값을 받아서 전송
  int sensorValue = analogRead(PressSensor);

  // 1000 이상일 경우 1, 그렇지 않으면 0
  int table_1_Status = (sensorValue > 1000) ? 1 : 0;

  //HTTP 전송
  sendPostRequest(table_1_Status);

  delay(1000);

}

// Wi-Fi 연결 함수
void connectWiFi() {
  Serial.println("Wi-Fi 연결 시도 중...");
  
  //모듈 확인
  sendCommand("AT", 1000); 
  // Wi-Fi 모드 설정 (Station 모드)
  sendCommand("AT+CWMODE=1", 1000); 
  // Wi-Fi 연결
  sendCommand("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"", 5000); 
  Serial.println("Wi-Fi 연결 완료!");
}

// HTTP POST 요청 함수
void sendPostRequest(int table_1_Status) {
  String jsonPayload = "{"
    "\"table_1\": " + String(table_1_Status) + ","  // table_1의 상태값을 동적으로 설정
    "\"table_2\": 0,"
    "\"table_3\": 0,"
    "\"table_4\": 0,"
    "\"table_5\": 0,"
    "\"table_6\": 0,"
    "\"table_7\": 0,"
    "\"table_8\": 0,"
    "\"table_9\": 0,"
    "\"table_10\": 0"
  "}";

  String httpRequest = 
    "POST /api/cafe/table-occupied-status HTTP/1.1\r\n"// 설계 API URL
    "Host: " + server + "\r\n"
    "Content-Type: application/json\r\n"
    "Content-Length: " + String(jsonPayload.length()) + "\r\n"
    "\r\n" + 
    jsonPayload;

  // HTTP 요청 로그 출력
  Serial.println("===== 보낸 HTTP 요청 =====");
  Serial.println(httpRequest);
  Serial.println("=========================");

  // TCP 연결 시작
  if (sendCommand("AT+CIPSTART=\"TCP\",\"" + server + "\",80", 5000)) {
    Serial.println("서버 연결 성공!");

    // 데이터 전송 요청
    sendCommand("AT+CIPSEND=" + String(httpRequest.length()), 1000);
    esp8266.print(httpRequest); // 실제 HTTP 요청 전송

    // 응답 확인
    delay(2000);
    while (esp8266.available()) {
      String response = esp8266.readString();
      Serial.println("===== 서버 응답 =====");
      Serial.println(response);
      Serial.println("=====================");
    }
  } else {
    Serial.println("서버 연결 실패.");
  }
}

// AT 명령어 전송 함수
bool sendCommand(String command, const int timeout) {
  
  esp8266.println(command); 
  
  long int time = millis();
  while ((millis() - time) < timeout) {
    if (esp8266.available()) {
      String response = esp8266.readString();
      Serial.println("응답: " + response);
      if (response.indexOf("OK") != -1 || response.indexOf("CONNECT") != -1) {
        return true;
      }
    }
  }
  return false;
}