#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

/**************** WIFI & MQTT ****************/
const char* WIFI_SSID     = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";

const char* MQTT_HOST     = "116.118.60.232";
const uint16_t MQTT_PORT  = 7177;
const char* MQTT_USERNAME = "iostream_broker";
const char* MQTT_PASSWORD_MQTT = "iostream_broker";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

/**************** TOPIC ****************/
// DATA
#define TOPIC_TEMP        "esp32/data/temperature"
#define TOPIC_HUM         "esp32/data/humidity"
#define TOPIC_WATER       "esp32/data/water"        // water level percent
#define TOPIC_SMOKE       "esp32/data/smoke"        // mq2 raw ADC
#define TOPIC_RAIN        "esp32/data/rain"         // stable 0/1
#define TOPIC_RAIN_RAW    "esp32/data/rain_raw"     // raw ADC

// OUTPUT STATE
#define TOPIC_GATE        "esp32/data/gate"
#define TOPIC_PUMP        "esp32/data/pump"
#define TOPIC_FAN         "esp32/data/fan"

// ALARM
#define TOPIC_ALARM       "esp32/data/alarm"        // EVENT JSON only
#define TOPIC_ALARM_STATE "esp32/data/alarm_state"  // safe/fire/flood

// CMD
#define CMD_GATE          "esp32/cmd/gate"
#define CMD_PUMP          "esp32/cmd/pump"
#define CMD_FAN           "esp32/cmd/fan"
#define CMD_BUZZER        "esp32/cmd/buzzer"

// ACK
#define ACK_GATE          "esp32/ack/gate"
#define ACK_PUMP          "esp32/ack/pump"
#define ACK_FAN           "esp32/ack/fan"
#define ACK_BUZZER        "esp32/ack/buzzer"

/**************** PIN MAP ****************/
#define DHT_PIN   32
#define DHT_TYPE  DHT11
DHT dht(DHT_PIN, DHT_TYPE);

#define TRIG_PIN  5
#define ECHO_PIN  19
const float MAX_WATER_DISTANCE_CM = 30.0;
const float MIN_WATER_DISTANCE_CM = 5.0;

#define MQ2_PIN   34
#define RAIN_PIN  35

#define SERVO_PIN 14
Servo gateServo;
const int SERVO_OPEN_ANGLE  = 0;
const int SERVO_CLOSE_ANGLE = 90;

#define RELAY_PUMP 26
#define RELAY_FAN  27

#define BUZZER_PIN 12
#define LED_WARN   13

/**************** THRESHOLDS ****************/
const int   MQ2_FIRE_TH   = 2200; // tune
const float TEMP_FIRE_TH  = 45.0;

const int RAIN_WET_TH = 1500; // tune
const int RAIN_DRY_TH = 2000; // tune

const float FLOOD_PCT_TH = 70.0;

/**************** STATE ****************/
bool pumpOn = false, fanOn = false, gateClosed = false;
bool buzzerManualOn = false;

bool fireDanger = false, floodDanger = false;
bool prevFireDanger = false, prevFloodDanger = false;

bool rainWet = false;
float mq2Ema = 0;

unsigned long lastPublish = 0;
unsigned long lastBuzzerToggle = 0;
bool buzzerPatternState = false;

/**************** WIFI ****************/
void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWiFi OK");
}

/**************** MQTT HELPERS ****************/
void sendAck(const char* topic) {
  StaticJsonDocument<64> doc;
  doc["status"] = "ack";
  char buf[64];
  size_t n = serializeJson(doc, buf);
  mqttClient.publish(topic, buf, n);
}

void publishAlarmEvent(const char* type, const char* severity, const char* message) {
  StaticJsonDocument<256> doc;
  doc["type"] = type;
  doc["severity"] = severity;
  doc["timestamp"] = (unsigned long)millis(); // demo; nếu muốn epoch -> NTP
  doc["message"] = message;

  char buf[256];
  size_t n = serializeJson(doc, buf);
  mqttClient.publish(TOPIC_ALARM, buf, n);
}

const char* getAlarmState() {
  if (fireDanger) return "fire";
  if (floodDanger) return "flood";
  return "safe";
}

/**************** MQTT CALLBACK ****************/
void mqttCallback(char* topic, byte* payload, unsigned int len) {
  String msg;
  msg.reserve(len);
  for (unsigned int i = 0; i < len; i++) msg += (char)payload[i];

  String tpc(topic);

  if (tpc == CMD_GATE) {
    if (msg == "open")  { gateServo.write(SERVO_OPEN_ANGLE);  gateClosed = false; }
    if (msg == "close") { gateServo.write(SERVO_CLOSE_ANGLE); gateClosed = true;  }
    sendAck(ACK_GATE);
  }
  else if (tpc == CMD_PUMP) {
    if (msg == "on")  { digitalWrite(RELAY_PUMP, LOW);  pumpOn = true;  }
    if (msg == "off") { digitalWrite(RELAY_PUMP, HIGH); pumpOn = false; }
    sendAck(ACK_PUMP);
  }
  else if (tpc == CMD_FAN) {
    if (msg == "on")  { digitalWrite(RELAY_FAN, LOW);  fanOn = true;  }
    if (msg == "off") { digitalWrite(RELAY_FAN, HIGH); fanOn = false; }
    sendAck(ACK_FAN);
  }
  else if (tpc == CMD_BUZZER) {
    if (msg == "on")  buzzerManualOn = true;
    if (msg == "off") buzzerManualOn = false;
    sendAck(ACK_BUZZER);
  }
}

/**************** MQTT CONNECT ****************/
void connectMQTT() {
  while (!mqttClient.connected()) {
    String clientId = "esp32-basement-";
    clientId += String((uint32_t)ESP.getEfuseMac(), HEX);

    if (mqttClient.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD_MQTT)) {
      mqttClient.subscribe(CMD_GATE);
      mqttClient.subscribe(CMD_PUMP);
      mqttClient.subscribe(CMD_FAN);
      mqttClient.subscribe(CMD_BUZZER);
      Serial.println("MQTT Connected & Subscribed");
    } else {
      delay(500);
    }
  }
}

/**************** SENSOR ****************/
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
  return ((MIN_WATER_DISTANCE_CM - d) /
          (MIN_WATER_DISTANCE_CM - MAX_WATER_DISTANCE_CM)) * 100;
}

void updateRainStatus(int rainRaw) {
  if (!rainWet && rainRaw < RAIN_WET_TH) rainWet = true;
  else if (rainWet && rainRaw > RAIN_DRY_TH) rainWet = false;
}

/**************** AUTOMATION ****************/
void handleFlood(float waterPct) {
  bool floodByPct  = (waterPct >= FLOOD_PCT_TH);
  bool floodByRain = rainWet;
  floodDanger = (floodByPct || floodByRain);

  if (floodDanger) {
    gateServo.write(SERVO_CLOSE_ANGLE);
    gateClosed = true;
    digitalWrite(RELAY_PUMP, LOW);
    pumpOn = true;
  }

  if (floodDanger && !prevFloodDanger) {
    publishAlarmEvent("flood", "HIGH", "Flood detected (water level or rain sensor)");
  }
  prevFloodDanger = floodDanger;
}

void handleFire(int mq2Raw, float temp) {
  if (mq2Ema == 0) mq2Ema = mq2Raw;
  mq2Ema = 0.8f * mq2Ema + 0.2f * mq2Raw;

  fireDanger = (mq2Ema >= MQ2_FIRE_TH || temp >= TEMP_FIRE_TH);

  if (fireDanger) {
    digitalWrite(RELAY_FAN, LOW);
    fanOn = true;
  }

  if (fireDanger && !prevFireDanger) {
    publishAlarmEvent("fire", "HIGH", "Fire risk detected (MQ2/Temp exceeded threshold)");
  }
  prevFireDanger = fireDanger;
}

void updateBuzzer() {
  if (buzzerManualOn) {
    digitalWrite(BUZZER_PIN, HIGH);
    return;
  }

  if (fireDanger) {
    unsigned long now = millis();
    if (now - lastBuzzerToggle >= 1000) {
      lastBuzzerToggle = now;
      buzzerPatternState = !buzzerPatternState;
    }
    digitalWrite(BUZZER_PIN, buzzerPatternState ? HIGH : LOW);
    return;
  }

  buzzerPatternState = false;
  digitalWrite(BUZZER_PIN, LOW);
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
  gateClosed = false;

  dht.begin();
  connectWiFi();

  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
}

/**************** LOOP ****************/
void loop() {
  if (!mqttClient.connected()) connectMQTT();
  mqttClient.loop();

  updateBuzzer();

  unsigned long now = millis();
  if (now - lastPublish >= 30000) {
    lastPublish = now;

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    float dist = readDistance();
    float waterPct = distanceToPercent(dist);

    int mq2Raw = analogRead(MQ2_PIN);
    int rainRaw = analogRead(RAIN_PIN);

    updateRainStatus(rainRaw);

    handleFlood(waterPct);
    handleFire(mq2Raw, t);

    digitalWrite(LED_WARN, (fireDanger || floodDanger) ? HIGH : LOW);

    mqttClient.publish(TOPIC_TEMP,  String(t).c_str());
    mqttClient.publish(TOPIC_HUM,   String(h).c_str());
    mqttClient.publish(TOPIC_WATER, String(waterPct).c_str());
    mqttClient.publish(TOPIC_SMOKE, String(mq2Raw).c_str());

    mqttClient.publish(TOPIC_RAIN_RAW, String(rainRaw).c_str());
    mqttClient.publish(TOPIC_RAIN, rainWet ? "1" : "0");

    mqttClient.publish(TOPIC_GATE, gateClosed ? "1" : "0");
    mqttClient.publish(TOPIC_PUMP, pumpOn ? "1" : "0");
    mqttClient.publish(TOPIC_FAN,  fanOn ? "1" : "0");

    mqttClient.publish(TOPIC_ALARM_STATE, getAlarmState());
  }
}
