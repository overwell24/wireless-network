const int PressSensor = A0;
int value = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(PressSensor);
  Serial.println(value);
  delay(1000);

}
