/*******************************************************
 * ESP32 Basement Monitor - Node tổng hợp
 * Mapping CHÍNH XÁC theo diagram.json Wokwi:
 *
 *  - DHT (wokwi-dht11)          → GPIO4
 *  - HC-SR04 TRIG               → GPIO5
 *  - HC-SR04 ECHO               → GPIO18
 *  - MQ-2 AOUT (gas sensor)     → GPIO34 (ADC)
 *  - Water leak button          → GPIO27 (INPUT_PULLUP, nhấn = có nước)
 *  - Gate water button          → GPIO26 (INPUT_PULLUP, nhấn = nước ở cửa)
 *  - Servo flood gate           → GPIO15
 *  - Relay pump                 → GPIO25
 *  - Relay fan                  → GPIO33
 *  - Buzzer                     → GPIO14
 *  - Warning LED (đỏ)           → GPIO2
 *  - Rain sensor (analog)       → GPIO35   // === RAIN SENSOR ===
 *
 *  Luồng:
 *    - Luồng ngập: HC-SR04 + water leak + gate water (+ rain sensor nếu muốn)
 *    - Luồng cháy: MQ-2 + fan
 *    - Luồng cảnh báo tổng: LED + buzzer (kết hợp flood/fire)
 *******************************************************/

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

/************* WIFI & MQTT CONFIG (DÙNG BROKER THẬT CỦA BẠN) *************/
const char* WIFI_SSID     = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";

// Broker ngoài: 116.118.60.232:7177 với user/pass iostream_broker
const char* MQTT_HOST      = "116.118.60.232";
const uint16_t MQTT_PORT   = 7177;
const char* MQTT_USERNAME  = "iostream_broker";
const char* MQTT_PASSWORD  = "iostream_broker";

// ClientId nên là unique – mình reuse kiểu bạn: "esp32-water-" + _TIME_
const char* MQTT_CLIENTID  = "esp32-gate-" _TIME_;

// Theo thiết kế hệ thống:
const char* SITE_ID        = "S1";
const char* DEVICE_ID      = "ESP32_GATE_01";

String dataTopic = String("site/") + SITE_ID + "/" + DEVICE_ID + "/data";
String cmdTopic  = String("site/") + SITE_ID + "/" + DEVICE_ID + "/cmd";
String ackTopic  = String("site/") + SITE_ID + "/" + DEVICE_ID + "/ack";

/************* PIN MAPPING (THEO diagram.json) *************/
// DHT (mô phỏng DHT22, thực tế có thể là DHT11)
#define DHT_PIN   4
#define DHT_TYPE  DHT22   // dùng DHT22 trong Wokwi; ra thực tế đổi thành DHT11 nếu cần

// HC-SR04
#define ULTRASONIC_TRIG_PIN  5
#define ULTRASONIC_ECHO_PIN  18
const float MAX_WATER_DISTANCE_CM = 30.0;
const float MIN_WATER_DISTANCE_CM = 5.0;

// MQ-2
#define MQ2_PIN   34   // analog

// === RAIN SENSOR ===
#define RAIN_SENSOR_PIN 35   // analog AOUT của cảm biến mưa

// Water Leak sensor (mô phỏng bằng pushbutton)
#define LEAK_PIN      27   // INPUT_PULLUP - LOW = có nước

// Gate Flood sensor (mô phỏng bằng pushbutton)
#define GATE_WATER_PIN  26 // INPUT_PULLUP - LOW = nước tới cửa

// Servo flood gate
#define SERVO_PIN   15
Servo gateServo;
const int SERVO_OPEN_ANGLE  = 0;
const int SERVO_CLOSE_ANGLE = 90;

// Relay pump & fan (wokwi-relay-module: IN active LOW)
#define RELAY_PUMP_PIN  25
#define RELAY_FAN_PIN   33

// Buzzer & LED
#define BUZZER_PIN      14
#define LED_WARN_PIN    2

/************* BIẾN & ĐỐI TƯỢNG *************/
WiFiClient espClient;
PubSubClient mqttClient(espClient);
DHT dht(DHT_PIN, DHT_TYPE);

unsigned long lastSensorPublish = 0;
const unsigned long SENSOR_PUBLISH_INTERVAL_MS = 5000;

bool pumpOn    = false;
bool fanOn     = false;
bool buzzerOn  = false;
bool gateClosed = false;

// Biến trạng thái luồng ngập/cháy cho hàm cảnh báo tổng
bool floodDanger = false;
bool fireDanger  = false;

/************* HÀM KẾT NỐI WIFI & MQTT *************/
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  uint8_t retry = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    retry++;
    if (retry > 40) {
      Serial.println("\nWiFi connect timeout, rebooting...");
      ESP.restart();
    }
  }
  Serial.println("\nWiFi connected.");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

// ####################################### CALL BACK ########################
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("[MQTT] Message [");
  Serial.print(topic);
  Serial.print("]: ");

  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  Serial.println(msg);

  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, msg);
  if (err) {
    Serial.print("JSON error: ");
    Serial.println(err.c_str());
    return;
  }

  String command   = doc["command"]   | "";
  String commandId = doc["commandId"] | "";

  // Điều khiển từ backend (có thể map với rules/commands)
  if (command == "open_gate") {
    gateServo.write(SERVO_OPEN_ANGLE);
    gateClosed = false;
  } else if (command == "close_gate") {
    gateServo.write(SERVO_CLOSE_ANGLE);
    gateClosed = true;
  } else if (command == "pump_on") {
    digitalWrite(RELAY_PUMP_PIN, LOW);  // active LOW
    pumpOn = true;
  } else if (command == "pump_off") {
    digitalWrite(RELAY_PUMP_PIN, HIGH);
    pumpOn = false;
  } else if (command == "fan_on") {
    digitalWrite(RELAY_FAN_PIN, LOW);
    fanOn = true;
  } else if (command == "fan_off") {
    digitalWrite(RELAY_FAN_PIN, HIGH);
    fanOn = false;
  } else if (command == "buzzer_on") {
    digitalWrite(BUZZER_PIN, HIGH);
    buzzerOn = true;
  } else if (command == "buzzer_off") {
    digitalWrite(BUZZER_PIN, LOW);
    buzzerOn = false;
  } else {
    Serial.println("Unknown command");
  }

  // Gửi ACK cho backend
  StaticJsonDocument<256> ackDoc;
  ackDoc["commandId"] = commandId;
  ackDoc["status"]    = "ack";
  ackDoc["deviceId"]  = DEVICE_ID;

  char ackBuf[256];
  size_t n = serializeJson(ackDoc, ackBuf, sizeof(ackBuf));
  mqttClient.publish(ackTopic.c_str(), ackBuf, n);
}

void connectMQTT() {
  while (!mqttClient.connected()) {
Serial.print("Connecting MQTT to ");
    Serial.print(MQTT_HOST);
    Serial.print(":");
    Serial.print(MQTT_PORT);
    Serial.print(" ... ");

    // Dùng clientId + username/password
    if (mqttClient.connect(MQTT_CLIENTID, MQTT_USERNAME, MQTT_PASSWORD)) {
      Serial.println("connected");
      mqttClient.subscribe(cmdTopic.c_str());
      Serial.print("Subscribed: ");
      Serial.println(cmdTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" retry in 3s");
      delay(3000);
    }
  }
}

/************* HÀM ĐỌC CẢM BIẾN *************/
float readTemperature() {
  float t = dht.readTemperature();
  if (isnan(t)) return -999.0;
  return t;
}

float readHumidity() {
  float h = dht.readHumidity();
  if (isnan(h)) return -999.0;
  return h;
}

float readDistanceCm() {
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);

  long duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH, 30000);
  if (duration == 0) return -1;
  float distance = duration * 0.0343 / 2.0;
  return distance;
}

float distanceToWaterPercent(float distanceCm) {
  if (distanceCm < 0) return -1;
  if (distanceCm > MAX_WATER_DISTANCE_CM) return 0;
  if (distanceCm < MIN_WATER_DISTANCE_CM) return 100;

  float ratio = (MAX_WATER_DISTANCE_CM - distanceCm) /
                (MAX_WATER_DISTANCE_CM - MIN_WATER_DISTANCE_CM);
  float pct = ratio * 100.0;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  return pct;
}

int readMQ2() {
  int value = analogRead(MQ2_PIN);
  return value;
}

// === RAIN SENSOR ===
// Đọc giá trị analog của cảm biến mưa (0–4095)
int readRain() {
  int value = analogRead(RAIN_SENSOR_PIN);
  return value;
}

// Nút pushbutton nối GND → dùng INPUT_PULLUP, LOW = có nước
bool readLeak() {
  int val = digitalRead(LEAK_PIN);
  // LOW = pressed = nước rò rỉ
  return (val == LOW);
}

bool readGateFlood() {
  int val = digitalRead(GATE_WATER_PIN);
  return (val == LOW);
}

/************* LUỒNG 1: XỬ LÝ NGẬP *************/
// Ngưỡng mực nước & logic demo – tùy bạn chỉnh
const float WATER_LEVEL_WARN_PCT  = 40.0;
const float WATER_LEVEL_DANGER_PCT = 70.0;

void handleFloodFlow(float waterPct, bool leak, bool gateFlood) {
  // Reset cờ
  floodDanger = false;

  // 1. Nếu có nước chảy (leak) hoặc nước tới cửa (gateFlood) → coi là nguy hiểm
  if (leak || gateFlood) {
    floodDanger = true;
  }

  // 2. Nếu mực nước từ HC-SR04 quá cao
  if (waterPct >= WATER_LEVEL_DANGER_PCT) {
    floodDanger = true;
  }

  // 3. Điều khiển cửa và bơm theo mức độ ngập (logic demo)
  if (floodDanger) {
    // Ngập nặng → đóng cửa + bật bơm
    gateServo.write(SERVO_CLOSE_ANGLE);
    gateClosed = true;

    digitalWrite(RELAY_PUMP_PIN, LOW); // ON
    pumpOn = true;
} else if (waterPct >= WATER_LEVEL_WARN_PCT) {
    // Ngập nhẹ → có thể giữ cửa đóng nhưng chưa bật bơm
    gateServo.write(SERVO_CLOSE_ANGLE);
    gateClosed = true;

    digitalWrite(RELAY_PUMP_PIN, HIGH); // OFF
    pumpOn = false;
  } else {
    // Bình thường → mở cửa, tắt bơm
    gateServo.write(SERVO_OPEN_ANGLE);
    gateClosed = false;

    digitalWrite(RELAY_PUMP_PIN, HIGH); // OFF
    pumpOn = false;
  }
}

/************* LUỒNG 2: XỬ LÝ CHÁY/ KHÓI *************/
// MQ-2 raw 0–4095, tự calibrate – tạm chọn threshold demo
const int MQ2_WARN_THRESHOLD   = 1600;
const int MQ2_DANGER_THRESHOLD = 2200;

void handleFireFlow(int mq2Value, float temperature) {
  fireDanger = false;

  // Nếu giá trị MQ-2 quá cao hoặc nhiệt độ cao → nguy hiểm
  if (mq2Value >= MQ2_DANGER_THRESHOLD || temperature >= 45.0) {
    fireDanger = true;
  }

  // Điều khiển quạt theo mức độ khói (logic demo)
  if (fireDanger) {
    // Khói dày → bật quạt để thông gió
    digitalWrite(RELAY_FAN_PIN, LOW); // ON
    fanOn = true;
  } else if (mq2Value >= MQ2_WARN_THRESHOLD) {
    // Cảnh báo – cho phép bật quạt nhẹ (tùy chỉnh)
    digitalWrite(RELAY_FAN_PIN, LOW); // ON
    fanOn = true;
  } else {
    digitalWrite(RELAY_FAN_PIN, HIGH); // OFF
    fanOn = false;
  }
}

/************* LUỒNG 3: CẢNH BÁO TỔNG (LED + BUZZER) *************/
void handleGlobalAlarmFlow() {
  // Nếu có bất kỳ nguy hiểm ngập/cháy → bật LED
  if (floodDanger || fireDanger) {
    digitalWrite(LED_WARN_PIN, HIGH);
  } else {
    digitalWrite(LED_WARN_PIN, LOW);
  }

  // Buzzer: ví dụ chỉ kêu khi fireDanger (khói nặng)
  if (fireDanger) {
    if (!buzzerOn) { // nếu backend chưa can thiệp
      digitalWrite(BUZZER_PIN, HIGH);
    }
  } else {
    if (!buzzerOn) {
      digitalWrite(BUZZER_PIN, LOW);
    }
  }
}

/************* PUBLISH TELEMETRY LÊN MQTT *************/
void publishTelemetry(float temp, float hum, float waterPct, int mq2Value,
                      bool leak, bool gateFlood, int rainValue) {  // thêm rainValue
  StaticJsonDocument<256> doc;
  doc["ts"] = millis();

  JsonObject metrics = doc.createNestedObject("metrics");
  metrics["temperature"] = temp;
  metrics["humidity"]    = hum;
  metrics["waterLevel"]  = waterPct;
  metrics["smoke"]       = mq2Value;
  metrics["waterLeak"]   = leak ? 1 : 0;
  metrics["gateFlood"]   = gateFlood ? 1 : 0;
  metrics["rain"]        = rainValue;    // === RAIN SENSOR METRIC ===

  JsonObject meta = doc.createNestedObject("meta");
  meta["siteId"]   = SITE_ID;
  meta["deviceId"] = DEVICE_ID;

  char buffer[512];
  size_t n = serializeJson(doc, buffer, sizeof(buffer));
  mqttClient.publish(dataTopic.c_str(), buffer, n);
}

/************* SETUP & LOOP *************/
void setup() {
  Serial.begin(115200);
  delay(500);

  // Pin mode
  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);
  pinMode(MQ2_PIN, INPUT);
pinMode(RAIN_SENSOR_PIN, INPUT);   // === RAIN SENSOR ===

  pinMode(LEAK_PIN, INPUT_PULLUP);
  pinMode(GATE_WATER_PIN, INPUT_PULLUP);

  pinMode(RELAY_PUMP_PIN, OUTPUT);
  pinMode(RELAY_FAN_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_WARN_PIN, OUTPUT);

  // relay OFF mặc định (HIGH vì active LOW)
  digitalWrite(RELAY_PUMP_PIN, HIGH);
  digitalWrite(RELAY_FAN_PIN, HIGH);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_WARN_PIN, LOW);

  // Servo
  gateServo.attach(SERVO_PIN);
  gateServo.write(SERVO_OPEN_ANGLE);
  gateClosed = false;

  // DHT
  dht.begin();

  // WiFi + MQTT
  connectWiFi();
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
}

void loop() {
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();

  unsigned long now = millis();
  if (now - lastSensorPublish >= SENSOR_PUBLISH_INTERVAL_MS) {
    lastSensorPublish = now;

    // 1) Đọc toàn bộ sensor
    float temp     = readTemperature();
    float hum      = readHumidity();
    float distCm   = readDistanceCm();
    float waterPct = distanceToWaterPercent(distCm);
    int   mq2Value = readMQ2();
    int   rainValue = readRain();     // === RAIN SENSOR ===
    bool  leak     = readLeak();
    bool  gateFlood = readGateFlood();

    Serial.println("===== SENSOR SNAPSHOT =====");
    Serial.print("Temp: ");  Serial.println(temp);
    Serial.print("Hum : ");  Serial.println(hum);
    Serial.print("Dist: ");  Serial.println(distCm);
    Serial.print("Water%: ");Serial.println(waterPct);
    Serial.print("MQ2  : "); Serial.println(mq2Value);
    Serial.print("Rain : "); Serial.println(rainValue);  // === RAIN SENSOR ===
    Serial.print("Leak : "); Serial.println(leak);
    Serial.print("Gate : "); Serial.println(gateFlood);

    // 2) Luồng NGẬP
    handleFloodFlow(waterPct, leak, gateFlood);

    // 3) Luồng CHÁY
    handleFireFlow(mq2Value, temp);

    // 4) Luồng CẢNH BÁO TỔNG
    handleGlobalAlarmFlow();

    // 5) Gửi Telemetry lên MQTT (có thêm rainValue)
    publishTelemetry(temp, hum, waterPct, mq2Value, leak, gateFlood, rainValue);
  }
}