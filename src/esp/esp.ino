#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <Preferences.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

/* ================= WIFI CONFIG ================= */
WebServer server(80);
DNSServer dnsServer;
Preferences prefs;
#define DNS_PORT 53

String wifiSSID = "";
String wifiPASS = "";
bool apMode = false;

/* ================= MQTT ================= */
const char* MQTT_HOST = "116.118.60.232";
const uint16_t MQTT_PORT = 7177;
const char* MQTT_USERNAME = "iostream_broker";
const char* MQTT_PASSWORD = "iostream_broker";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

/* ================= MQTT TOPICS ================= */
#define TOPIC_TEMP        "esp32/data/temperature"
#define TOPIC_HUM         "esp32/data/humidity"
#define TOPIC_WATER       "esp32/data/water"
#define TOPIC_SMOKE       "esp32/data/smoke"
#define TOPIC_RAIN        "esp32/data/rain"
#define TOPIC_RAIN_RAW    "esp32/data/rain_raw"

#define TOPIC_GATE        "esp32/data/gate"
#define TOPIC_PUMP        "esp32/data/pump"
#define TOPIC_FAN         "esp32/data/fan"

#define TOPIC_ALARM       "esp32/data/alarm"
#define TOPIC_ALARM_STATE "esp32/data/alarm_state"

#define CMD_GATE   "esp32/cmd/gate"
#define CMD_PUMP   "esp32/cmd/pump"
#define CMD_FAN    "esp32/cmd/fan"
#define CMD_BUZZER "esp32/cmd/buzzer"

#define ACK_GATE   "esp32/ack/gate"
#define ACK_PUMP   "esp32/ack/pump"
#define ACK_FAN    "esp32/ack/fan"
#define ACK_BUZZER "esp32/ack/buzzer"

/* ================= PIN MAP ================= */
#define DHT_PIN   32
#define DHT_TYPE  DHT11
DHT dht(DHT_PIN, DHT_TYPE);

#define TRIG_PIN  5
#define ECHO_PIN  19
#define MQ2_PIN   34
#define RAIN_PIN  35

#define SERVO_PIN 14
Servo gateServo;
const int SERVO_OPEN_ANGLE  = 135;
const int SERVO_CLOSE_ANGLE = 0;

#define RELAY_PUMP 26
#define RELAY_FAN  27
#define BUZZER_PIN 12
#define LED_WARN   13

/* ================= THRESHOLD ================= */
const int   MQ2_FIRE_TH   = 800;
const float TEMP_FIRE_TH = 45.0;
const float FLOOD_TH     = 3.5;
const int RAIN_WET_TH = 3000;     // Ngưỡng mưa (Analog thấp = ướt)
const int RAIN_DRY_TH = 2000;


/* ================= STATE ================= */
bool pumpOn = false, fanOn = false, gateClosed = false;
bool buzzerManualOn = false;

bool fireDanger = false, floodDanger = false;
//bool prevFloodDanger = false;

bool rainWet = false;
float mq2Ema = 0;

//bool gateAutoControl = true;
//bool pumpAutoControl = true;

unsigned long lastPublish = 0;
unsigned long lastSend = 0;
unsigned long lastBuzzerToggle = 0;
bool buzzerPatternState = false;
bool isFirstConnect = true;

/* ================= WIFI CONFIG PORTAL ================= */
String wifiPage() {
  int n = WiFi.scanNetworks();
  String options = "";
  for (int i = 0; i < n; i++) {
    int rssi = WiFi.RSSI(i);
    String strength = (rssi >= -50) ? "Mạnh" : (rssi >= -70) ? "Trung bình" : "Yếu";
    options += "<option value='" + WiFi.SSID(i) + "'>" + WiFi.SSID(i) + " (" + strength + ")</option>";
  }

  String html = R"rawliteral(
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ESP32 Config</title>
<style>
body{font-family:Arial,sans-serif;background:linear-gradient(to right,#4facfe,#00f2fe);display:flex;justify-content:center;align-items:center;height:100vh;margin:0}
.container{background:#fff;padding:30px;border-radius:15px;box-shadow:0 10px 25px rgba(0,0,0,0.2);width:90%;max-width:400px;text-align:center}
select,input{width:100%;padding:10px;margin:10px 0;border:1px solid #ccc;border-radius:5px}
input[type="submit"]{background:#4facfe;color:#fff;border:none;cursor:pointer;font-weight:bold}
</style></head><body>
<div class="container">
  <h2>Cấu hình WiFi</h2>
  <form action="/save" method="POST">
    SSID:<br><select name="ssid">)rawliteral" + options + R"rawliteral(</select>
    Pass:<br><input type="password" name="pass" placeholder="Mật khẩu WiFi">
    <input type="submit" value="Lưu & Kết nối">
  </form>
</div></body></html>)rawliteral";
  return html;
}

String resultPage(bool success, String ssid) {
  String msg = success ? "Kết nối thành công: " + ssid + ". Đang khởi động lại..." : "Kết nối thất bại. Vui lòng thử lại.";
  return "<html><body style='font-family:Arial;text-align:center;padding:50px;'><h2>" + msg + "</h2></body></html>";
}

bool tryConnectWiFi(const String& ssid, const String& pass, unsigned long timeout=12000) {
  Serial.println("Dang ket noi WiFi: " + ssid);
  WiFi.disconnect(); 
  WiFi.mode(WIFI_AP_STA); 
  WiFi.begin(ssid.c_str(), pass.c_str());
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
    if (millis() - start > timeout) { WiFi.disconnect(); return false; }
  }
  Serial.println("\nWiFi Connected!");
  return true;
}

void handleSave() {
  String ssid = server.arg("ssid");
  String pass = server.arg("pass");
  if (tryConnectWiFi(ssid, pass)) {
    prefs.begin("wifi", false);
    prefs.putString("ssid", ssid);
    prefs.putString("pass", pass);
    prefs.end();
    server.send(200, "text/html", resultPage(true, ssid));
    delay(2000); ESP.restart();
  } else {
    server.send(200, "text/html", resultPage(false, ssid));
  }
}

void startAPMode() {
  apMode = true;
  WiFi.mode(WIFI_AP);
  WiFi.softAP("Group_3_Config");
  dnsServer.start(DNS_PORT, "*", WiFi.softAPIP());
  server.on("/", [](){ server.send(200, "text/html", wifiPage()); });
  server.on("/save", HTTP_POST, handleSave);
  server.onNotFound([]() {
    server.sendHeader("Location", String("http://192.168.4.1/"), true);
    server.send(302, "text/plain", "");
  });
  server.begin();
  Serial.println("Da bat che do AP Mode. IP: 192.168.4.1");
}

/* ================= SENSOR ================= */
float readDistance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(3);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long dur = pulseIn(ECHO_PIN, HIGH, 30000);
  if (dur <= 0) return -1;
  return dur * 0.0343 / 2.0;
}

void updateRainStatus(int rainRaw) {
  
  if (rainRaw > RAIN_WET_TH) rainWet = true;
  else if (rainRaw < RAIN_DRY_TH) rainWet = false;
}

// void sendAck(const char* topic) {
//   StaticJsonDocument<64> doc;
//   doc["status"] = "ack";
//   char buf[64];
//   serializeJson(doc, buf);
//   mqttClient.publish(topic, buf);
// }

void publishAlarmEvent(const char* type, const char* severity, const char* message) {
  StaticJsonDocument<256> doc;
  doc["type"] = type;
  doc["severity"] = severity;
  doc["timestamp"] = (unsigned long)millis(); 
  doc["message"] = message;
  char buf[256];
  serializeJson(doc, buf);
  mqttClient.publish(TOPIC_ALARM, buf);
}

void updateBuzzer() {
  if (buzzerManualOn) {
    digitalWrite(BUZZER_PIN, HIGH);
    return;
  }
  if (fireDanger || floodDanger) {
    if (millis() - lastBuzzerToggle > 500) {
      lastBuzzerToggle = millis();
      buzzerPatternState = !buzzerPatternState;
      digitalWrite(BUZZER_PIN, buzzerPatternState);
    }
    return;
  }
  digitalWrite(BUZZER_PIN, LOW);
}

/* ================= MQTT ================= */
bool parseCmd(String msg) {
  msg.toLowerCase();
  msg.trim();
  if (msg == "1" || msg == "on" || msg == "true") return true;
  if (msg == "0" || msg == "off" || msg == "false") return false;
  return false;
}

void mqttCallback(char* topic, byte* payload, unsigned int len) {
  String msg = "";
  for (unsigned int i = 0; i < len; i++) msg += (char)payload[i];
  String tpc = String(topic);
  bool cmdOn = parseCmd(msg);

  if (tpc == CMD_GATE) {
    //gateAutoControl = false;
    gateServo.write(cmdOn ? SERVO_CLOSE_ANGLE : SERVO_OPEN_ANGLE);
    gateClosed = cmdOn; //doan nay check lai
    mqttClient.publish(ACK_GATE, "ack");
    mqttClient.publish(TOPIC_GATE, gateClosed ? "1" : "0");
  }

  else if (tpc == CMD_PUMP) {
    //pumpAutoControl = false;
    digitalWrite(RELAY_PUMP, cmdOn ? HIGH : LOW);
    pumpOn = cmdOn;
    mqttClient.publish(ACK_PUMP, "ack");
    mqttClient.publish(TOPIC_PUMP, pumpOn ? "1" : "0");
  }

  else if (tpc == CMD_FAN) {
    digitalWrite(RELAY_FAN, cmdOn ? HIGH : LOW);
    fanOn = cmdOn;
    mqttClient.publish(ACK_FAN, "ack");
    mqttClient.publish(TOPIC_FAN, fanOn ? "1" : "0");
  }

  else if (tpc == CMD_BUZZER) {
    buzzerManualOn = cmdOn;
    digitalWrite(BUZZER_PIN, cmdOn);
    mqttClient.publish(ACK_BUZZER, "ack");
  }
}

void connectMQTT() {
  while (!mqttClient.connected()) {
    if (mqttClient.connect("ESP32_FINAL", MQTT_USERNAME, MQTT_PASSWORD)) {
      mqttClient.subscribe("esp32/cmd/#");
    } else {
      delay(2000);
    }
  }
}

/* ================= SETUP & LOOP ================= */
void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(RELAY_PUMP, OUTPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_WARN, OUTPUT);
  pinMode(RAIN_PIN, INPUT);

  digitalWrite(RELAY_PUMP, LOW);
  digitalWrite(RELAY_FAN, LOW);
  digitalWrite(BUZZER_PIN, HIGH);

  gateServo.attach(SERVO_PIN);
  gateServo.write(SERVO_OPEN_ANGLE);

  dht.begin();

  prefs.begin("wifi", true);
  wifiSSID = prefs.getString("ssid", "");
  wifiPASS = prefs.getString("pass", "");
  prefs.end();

  if (wifiSSID != "" && tryConnectWiFi(wifiSSID, wifiPASS)) {
    mqttClient.setServer(MQTT_HOST, MQTT_PORT);
    mqttClient.setCallback(mqttCallback);
  } else {
    startAPMode();
  }
}

void loop() {
  if (apMode) {
    dnsServer.processNextRequest();
    server.handleClient();
    return;
  }

  if (!mqttClient.connected()) connectMQTT();
  mqttClient.loop();

  updateBuzzer();

  if (millis() - lastPublish > 100) {
    lastPublish = millis();

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    float waterLevel = 6 - readDistance();
    int mq2Raw = analogRead(MQ2_PIN);
    int rainRaw = analogRead(RAIN_PIN); // Đọc thực tế từ cảm biến mưa
    Serial.print("RAIN RAW: ");
    Serial.println(rainRaw);
    updateRainStatus(rainRaw);


    mq2Ema = (mq2Ema == 0) ? mq2Raw : 0.8 * mq2Ema + 0.2 * mq2Raw;
    fireDanger = (mq2Ema >= MQ2_FIRE_TH || t >= TEMP_FIRE_TH);
    

    if (fireDanger) {
      //digitalWrite(RELAY_FAN, LOW);
      //fanOn = true;
      if (millis() - lastSend > 30000) {
        lastSend = millis();
        publishAlarmEvent("fire", "HIGH", "Fire risk detected (MQ2/Temp exceeded threshold)");
      }
    }


    floodDanger = (waterLevel >= FLOOD_TH || rainWet);
    if (floodDanger) {
      //gateAutoControl = true;
      //pumpAutoControl = true;
      //gateServo.write(SERVO_CLOSE_ANGLE);
      //gateClosed = true;
      //digitalWrite(RELAY_PUMP, LOW);
      //pumpOn = true;
      if (millis() - lastSend > 30000) {
        lastSend = millis();
        publishAlarmEvent("flood", "HIGH", "Flood detected (water level or rain sensor)");
      }
    }

    // if (!floodDanger && prevFloodDanger) {
    //   gateAutoControl = false;
    //   pumpAutoControl = false;
    // }
    // prevFloodDanger = floodDanger;

    digitalWrite(LED_WARN, fireDanger || floodDanger);
    // Gửi MQTT
    mqttClient.publish(TOPIC_TEMP,  String(t).c_str());
    mqttClient.publish(TOPIC_HUM,   String(h).c_str());
    mqttClient.publish(TOPIC_WATER, String(waterLevel).c_str());
    mqttClient.publish(TOPIC_SMOKE, String(mq2Raw).c_str());
    
    mqttClient.publish(TOPIC_RAIN, rainWet ? "1" : "0"); // 1: Mưa, 0: Tạnh
    

    String sys = fireDanger ? "fire" : floodDanger ? "flood" : "safe";
    mqttClient.publish(TOPIC_ALARM_STATE, sys.c_str());

  }

}