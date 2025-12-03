/*******************************************************
 * ESP32 Basement Monitor - FINAL VERSION (Triết’s node)
 * Mapping mới – Topic riêng – Chuẩn YCCB + YCNC
 *******************************************************/

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

/**************** WIFI & MQTT ****************/
const char* WIFI_SSID     = "15 Ent 2.4GHz";
const char* WIFI_PASSWORD = "15@Entertainment";

const char* MQTT_HOST     = "116.118.60.232";
const uint16_t MQTT_PORT  = 7177;
const char* MQTT_USERNAME = "iostream_broker";
const char* MQTT_PASSWORD_MQTT = "iostream_broker";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

/**************** TOPIC — PHƯƠNG ÁN A ****************/

// DATA
#define TOPIC_TEMP      "esp32/data/temperature"
#define TOPIC_HUM       "esp32/data/humidity"
#define TOPIC_WATER     "esp32/data/water"
#define TOPIC_SMOKE     "esp32/data/smoke"
#define TOPIC_RAIN      "esp32/data/rain"

// OUTPUT STATE FEEDBACK
#define TOPIC_GATE      "esp32/data/gate"
#define TOPIC_PUMP      "esp32/data/pump"
#define TOPIC_FAN       "esp32/data/fan"
#define TOPIC_ALARM     "esp32/data/alarm"

// CMD
#define CMD_GATE        "esp32/cmd/gate"
#define CMD_PUMP        "esp32/cmd/pump"
#define CMD_FAN         "esp32/cmd/fan"
#define CMD_BUZZER      "esp32/cmd/buzzer"

// ACK
#define ACK_GATE        "esp32/ack/gate"
#define ACK_PUMP        "esp32/ack/pump"
#define ACK_FAN         "esp32/ack/fan"
#define ACK_BUZZER      "esp32/ack/buzzer"

/**************** PIN MAPPING (NEW) ****************/

// DHT11 – GPIO 32
#define DHT_PIN   32
#define DHT_TYPE  DHT11
DHT dht(DHT_PIN, DHT_TYPE);

// Ultrasonic
#define TRIG_PIN  5
#define ECHO_PIN  19
const float MAX_WATER_DISTANCE_CM = 30.0;
const float MIN_WATER_DISTANCE_CM = 5.0;

// MQ-2 (ADC)
#define MQ2_PIN   34

// Rain Water Sensor
#define RAIN_PIN  35

// Servo Flood Gate
#define SERVO_PIN 14
Servo gateServo;
const int SERVO_OPEN_ANGLE  = 0;
const int SERVO_CLOSE_ANGLE = 90;

// Relay pump & fan
#define RELAY_PUMP 26
#define RELAY_FAN  27

// Buzzer + Warning LED
#define BUZZER_PIN 12
#define LED_WARN   13

/**************** STATE VARIABLES ****************/
bool pumpOn = false;
bool fanOn = false;
bool buzzerOn = false;
bool gateClosed = false;

bool fireDanger = false;
bool floodDanger = false;

unsigned long lastPublish = 0;

/**************** WIFI CONNECT ****************/
void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWiFi OK");
}

/**************** MQTT CALLBACK ****************/
void sendAck(const char* topic) {
  StaticJsonDocument<64> doc;
  doc["status"] = "ack";
  char buf[64];
  size_t n = serializeJson(doc, buf);
  mqttClient.publish(topic, buf, n);
}

void mqttCallback(char* topic, byte* payload, unsigned int len) {
  String msg;
  for (int i = 0; i < len; i++) msg += (char)payload[i];

  if (String(topic) == CMD_GATE) {
    if (msg == "open") {
      gateServo.write(SERVO_OPEN_ANGLE);
      gateClosed = false;
    } else if (msg == "close") {
      gateServo.write(SERVO_CLOSE_ANGLE);
      gateClosed = true;
    }
    sendAck(ACK_GATE);
  }

  else if (String(topic) == CMD_PUMP) {
    if (msg == "on")  { digitalWrite(RELAY_PUMP, LOW); pumpOn = true; }
    if (msg == "off") { digitalWrite(RELAY_PUMP, HIGH); pumpOn = false; }
    sendAck(ACK_PUMP);
  }

  else if (String(topic) == CMD_FAN) {
    if (msg == "on")  { digitalWrite(RELAY_FAN, LOW); fanOn = true; }
    if (msg == "off") { digitalWrite(RELAY_FAN, HIGH); fanOn = false; }
    sendAck(ACK_FAN);
  }

  else if (String(topic) == CMD_BUZZER) {
    if (msg == "on")  { digitalWrite(BUZZER_PIN, HIGH); buzzerOn = true; }
    if (msg == "off") { digitalWrite(BUZZER_PIN, LOW); buzzerOn = false; }
    sendAck(ACK_BUZZER);
  }
}

/**************** MQTT CONNECT ****************/
void connectMQTT() {
  while (!mqttClient.connected()) {
    if (mqttClient.connect("esp32-basement", MQTT_USERNAME, MQTT_PASSWORD_MQTT)) {
      mqttClient.subscribe(CMD_GATE);
      mqttClient.subscribe(CMD_PUMP);
      mqttClient.subscribe(CMD_FAN);
      mqttClient.subscribe(CMD_BUZZER);
    } else delay(500);
  }
}

/**************** SENSOR READ ****************/
float readDistance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(3);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long dur = pulseIn(ECHO_PIN, HIGH, 30000);
  if (dur <= 0) return -1;
  return dur * 0.0343 / 2.0;
}

float distanceToPercent(float d) {
  if (d < 0) return -1;
  if (d > MAX_WATER_DISTANCE_CM) return 0;
  if (d < MIN_WATER_DISTANCE_CM) return 100;
  return ((MAX_WATER_DISTANCE_CM - d) /
          (MAX_WATER_DISTANCE_CM - MIN_WATER_DISTANCE_CM)) * 100;
}

/**************** FLOOD & FIRE AUTOMATION ****************/
//đọc water rain sensor
void handleFlood(float pct) {
  floodDanger = (pct >= 70.0);

  if (floodDanger) {
    gateServo.write(SERVO_CLOSE_ANGLE);
    gateClosed = true;
    digitalWrite(RELAY_PUMP, LOW);
    pumpOn = true;
  }
}

void handleFire(int mq2Value, float temp) {
  fireDanger = (mq2Value >= 2200 || temp >= 45.0);

  if (fireDanger) {
    digitalWrite(RELAY_FAN, LOW);
    fanOn = true;
    digitalWrite(BUZZER_PIN, HIGH);
  }
}

/**************** SETUP ****************/
void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(MQ2_PIN, INPUT);
  pinMode(RAIN_PIN, INPUT);

  pinMode(RELAY_PUMP, OUTPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_WARN, OUTPUT);

  digitalWrite(RELAY_PUMP, HIGH);
  digitalWrite(RELAY_FAN, HIGH);
  digitalWrite(BUZZER_PIN, LOW);

  gateServo.attach(SERVO_PIN);
  gateServo.write(SERVO_OPEN_ANGLE);

  dht.begin();
  connectWiFi();

  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
}

/**************** LOOP ****************/
void loop() {
  if (!mqttClient.connected()) connectMQTT();
  mqttClient.loop();
  //xử lý thời gian gửi ở đây 
  //unsigned long now = millis();
  //if (now - lastPublish >= 3000) {
    //lastPublish = now;

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    float dist = readDistance();
    float waterPct = distanceToPercent(dist);
    int mq2Val = analogRead(MQ2_PIN);
    int rainVal = analogRead(RAIN_PIN);

    // Automation
    handleFlood(waterPct);
    handleFire(mq2Val, t);

    // Global warning LED
    digitalWrite(LED_WARN, (floodDanger || fireDanger) ? HIGH : LOW);

    // Publish individual topics
    mqttClient.publish(TOPIC_TEMP, String(t).c_str());
    mqttClient.publish(TOPIC_HUM,  String(h).c_str());
    mqttClient.publish(TOPIC_WATER, String(waterPct).c_str());
    mqttClient.publish(TOPIC_SMOKE, String(mq2Val).c_str());
    mqttClient.publish(TOPIC_RAIN,  String(rainVal).c_str());

    mqttClient.publish(TOPIC_GATE, gateClosed ? "1" : "0");
    mqttClient.publish(TOPIC_PUMP, pumpOn ? "1" : "0");
    mqttClient.publish(TOPIC_FAN, fanOn ? "1" : "0");
    mqttClient.publish(TOPIC_ALARM, fireDanger ? "fire" : (floodDanger ? "flood" : "safe"));
  //}
}
