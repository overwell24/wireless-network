#include <SoftwareSerial.h>

// SoftwareSerial 핀 설정 (RX, TX)
SoftwareSerial esp8266(2, 3);

// Wi-Fi 및 서버 설정
String ssid = "Minee";          // Wi-Fi 이름
String password = "test123!!!"; // Wi-Fi 비밀번호
String server = "15.165.161.251";   // 서버 IP

// 압력센서 A0핀
int pressSensor = A0;
// 압력센서 설치 테이블
int table_1_value = 0;

// 데이터 전송 주기 설정 (1초)
const unsigned long sendInterval = 1000;
unsigned long previousMillis = 0;

// sendCommand 함수 프로토타입 선언 (AT Command 처리 함수)
bool sendCommand(String command, const int timeout);

void setup() {
  // 기본 통신 설정
  Serial.begin(9600);
  esp8266.begin(9600);

  // Wi-Fi 연결
  if (!connectWiFi()) {
    Serial.println("Wi-Fi 연결 실패. 재시도 중...");
    while (!connectWiFi()) {
      delay(5000);
    }
  }
  Serial.println("Wi-Fi 연결 성공!");
}

// Wi-Fi 연결 함수
bool connectWiFi() {
  Serial.println("Wi-Fi 연결 시도 중...");

  // AT 명령어로 모듈 응답 확인
  if (!sendCommand("AT", 2000)) return false;

  // Station 모드 설정(인터넷 접속 및 서버 통신 모드)
  if (!sendCommand("AT+CWMODE=1", 1000)) return false;

  // Wi-Fi 연결
  String connectCmd = "AT+CWJAP=\"" + ssid + "\",\"" + password + "\"";
  if (sendCommand(connectCmd, 10000)) {
    return true;
  }

  return false;
}

// AT 명령어 전송 함수
bool sendCommand(String command, const int timeout) {
  Serial.println("명령어 전송: " + command);

  esp8266.println(command);
  long int time = millis();

  while ((millis() - time) < timeout) {
    if (esp8266.available()) {
      String response = esp8266.readString();
      Serial.println("응답: " + response);

      // 'OK' 또는 'CONNECT' 또는 'no change'에 대해 성공으로 처리
      if (response.indexOf("OK") != -1 || response.indexOf("CONNECT") != -1 || response.indexOf("no change") != -1) {
        Serial.println("OK");
        return true;
      }
      // 'busy p...' 응답 처리
      else if (response.indexOf("busy p...") != -1) {
        Serial.println("응답: busy p... Wi-Fi 연결 중...");
        delay(2000);
      } else if (response.indexOf("ERROR") != -1) {
        Serial.println("오류 응답: " + response);
        return false;
      }
    }
  }

  Serial.println("응답 없음.");
  return false;
}

void loop() {
  unsigned long currentMillis = millis();

  // 1초마다 데이터를 전송
  if (currentMillis - previousMillis >= sendInterval) { //아두이노를 동작한 시간 - 이 전 아두이노를 동작한 시간이 sendInterval(1초)보다 크면 실행
    previousMillis = currentMillis;

    // A0 핀에서 압력 센서 값 읽기
    int pressValue = analogRead(pressSensor);

    // 압력 센서 값에 따른 table_1 값 설정
    table_1_value = (pressValue > 1000) ? 1 : 0;

    // HTTP POST 요청 함수 호출
    sendPostRequest();
  }
}

// HTTP POST 요청 함수
void sendPostRequest() {
  // 설계된 JSON 형식으로 값 전달
  String jsonPayload = "{\"cafe_id\": 1, \"table_1\": " + String(table_1_value) + ", \"table_2\": 0, \"table_3\": 0, \"table_4\": 1, \"table_5\": 0, \"table_6\": 0, \"table_7\": 0, \"table_8\": 0}";

  // HTTP 요청
  String httpRequest =
    "POST /api/cafe/table-occupied-status HTTP/1.1\r\n"
    "Host: " + server + "\r\n"
    "Content-Type: application/json\r\n"
    "Content-Length: " + String(jsonPayload.length()) + "\r\n"
    "\r\n" +
    jsonPayload;

  // HTTP 요청 로그 출력
  Serial.println("===== 보낸 HTTP 요청 =====");
  Serial.println(httpRequest);
  Serial.println("=========================");

  // 서버 연결 시작
  if (sendCommand("AT+CIPSTART=\"TCP\",\"" + server + "\",80", 5000)) {
    Serial.println("서버 연결 성공!");

    // 데이터 전송 요청
    sendCommand("AT+CIPSEND=" + String(httpRequest.length()), 1000);
    esp8266.print(httpRequest);

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
