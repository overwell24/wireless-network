#include <SoftwareSerial.h>
#define rxPin 3
#define txPin 2

int PressSensor = A0;

SoftwareSerial esp01(txPin, rxPin);


void setup() {
  Serial.begin(9600); //아두이노-PC통신
  esp01.begin(9600);  //아두이노-WIFI통신
}

void loop() {
  
  int value = analogRead(PressSensor);
  Serial.println(value);
  delay(1000);
    

  if (esp01.available()) {
    Serial.write(esp01.read());
  }

  if(Serial.available()){
    esp01.write(Serial.read());
  }
}
