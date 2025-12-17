// import { generateText } from "./geminiClient.service.js";
// import User from "../user/user.model.js";

// const QUERY_INTENTS = {
//   USER: "USER",
//   TEMPERATURE: "TEMPERATURE",
//   WATER_LEVEL: "WATER_LEVEL",
//   DEVICE_STATUS: "DEVICE_STATUS",
//   SYSTEM_STATUS: "SYSTEM_STATUS",
//   UNKNOWN: "UNKNOWN",
// };

// function buildIntentPrompt(question) {
//   return `
// You are an intent classifier.

// RULES:
// - Choose ONLY ONE intent
// - Extract parameters if needed
// - DO NOT explain
// - DO NOT invent
// - If not matched, return UNKNOWN

// INTENTS:
// - USER
// - TEMPERATURE
// - WATER_LEVEL
// - DEVICE_STATUS
// - SYSTEM_STATUS
// - UNKNOWN

// Respond ONLY in JSON.

// FORMAT:
// {
//   "intent": "INTENT_NAME",
//   "deviceName": "optional"
// }

// USER QUESTION:
// ${question}
// `;
// }

// function buildAnswerPrompt(data, question) {
//   return `
// You are an IoT assistant.
// Answer ONLY using the data below.
// Do NOT make assumptions.

// DATA:
// ${JSON.stringify(data, null, 2)}

// USER QUESTION:
// ${question}
// `;
// }

// async function queryDB(intent, userId, params = {}) {
//   switch (intent) {
//     case QUERY_INTENTS.USER: {
//       const user = await User.findById(userId).lean();
//       if (!user) return null;

//       return {
//         name: user.name,
//         email: user.email,
//         username: user.username,
//       };
//     }

//     default:
//       return null;
//   }
// }

// export const chatService = async (message, userId) => {
//   const question = message?.message || message;

//   let intentRaw = "";
//   try {
//     intentRaw = await generateText(buildIntentPrompt(question));
//   } catch (err) {
//     console.error("Error generating intent:", err);
//     return "AI hiện không khả dụng, vui lòng thử lại sau.";
//   }

//   console.log(intentRaw);

//   let intent = QUERY_INTENTS.UNKNOWN;
//   let params = {};

//   try {
//     const parsed = JSON.parse(intentRaw);
//     if (QUERY_INTENTS[parsed.intent]) {
//       intent = parsed.intent;
//     }
//     if (parsed.deviceName) {
//       params.deviceName = parsed.deviceName;
//     }
//   } catch {
//     intent = QUERY_INTENTS.UNKNOWN;
//   }

//   if (intent === QUERY_INTENTS.UNKNOWN) {
//     return "Câu hỏi này hiện chưa được hỗ trợ.";
//   }

//   const data = await queryDB(intent, userId, params);
//   if (!data) {
//     return "Không tìm thấy dữ liệu phù hợp.";
//   }

//   let answer = "";
//   try {
//     answer = await generateText(buildAnswerPrompt(data, question));
//   } catch (err) {
//     console.error("Error generating answer:", err);
//     return "AI hiện không khả dụng, vui lòng thử lại sau.";
//   }

//   return answer;
// };

import { generateText } from "./geminiClient.service.js";
import User from "../user/user.model.js";
import sensorsModel from "../sensors/sensors.model.js";
import devicesModel from "../devices/devices.model.js";

const QUERY_TYPES = {
  USER: "USER",
  ALL_SENSORS: "ALL_SENSORS",
  ALL_DEVICES: "ALL_DEVICES",
  SPECIFIC_SENSOR: "SPECIFIC_SENSOR",
  SPECIFIC_DEVICE: "SPECIFIC_DEVICE",
  UNKNOWN: "UNKNOWN",
};

function buildInputPrompt(question) {

  return `
You are an intent classifier for a Smart Home Flood System.
Choose ONLY ONE intent:
- USER: About personal profile.
- ALL_SENSORS: Asking about all sensor readings (temp, water, rain, smoke) at once.
- ALL_DEVICES: Asking about status of all hardware (fan, pump, light, buzzer).
- SPECIFIC_SENSOR: Asking about ONE specific sensor.
- SPECIFIC_DEVICE: Asking about ONE specific hardware device.

Respond ONLY in JSON.
FORMAT:
{
  "type": "INTENT_NAME",
  "target": "temperature | water | rain | smoke | fan | pump | light | buzzer | none"
}

USER QUESTION: "${question}"`;

}

async function queryDB(type, username, target = null) {
  try {
    switch (type) {
      case QUERY_TYPES.USER:
        return await User.findOne({ username }).select("-password").lean();

      case QUERY_TYPES.ALL_SENSORS: {
        const sensorTypes = ["temperature", "rain", "smoke", "water_level"];
        const latestLogs = await Promise.all(
          sensorTypes.map(s =>
            sensorsModel.findOne({ sensor: s }).sort({ ts: -1 }).lean()
          )
        );
        return latestLogs.filter(log => log !== null);
      }

      case QUERY_TYPES.ALL_DEVICES: {
        const deviceTypes = ["fan", "pump", "light", "buzzer"];
        const latestDevices = await Promise.all(
          deviceTypes.map(d =>
            devicesModel.findOne({ device: d }).sort({ ts: -1 }).lean()
          )
        );
        return latestDevices.filter(d => d !== null);
      }

      case QUERY_TYPES.SPECIFIC_SENSOR: {
        const data = await sensorsModel.findOne({ sensor: target })
          .sort({ ts: -1 })
          .lean();
        if (!data) return null;
        return {
          name: data.sensor,
          value: data.value,
          time: data.ts,
          deviceId: data.deviceId
        };
      }

      case QUERY_TYPES.SPECIFIC_DEVICE: {
        const data = await devicesModel.findOne({ device: target })
          .sort({ ts: -1 })
          .lean();
        if (!data) return null;
        return {
          name: data.device,
          status: data.value,
          time: data.ts
        };
      }

      default:
        return null;
    }
  } catch (error) {
    console.error("Database Query Error:", error);
    return null;
  }
}

function getUnit(target) {
  const units = { temperature: "°C", water: "cm", rain: "%", smoke: "ppm" };
  return units[target] || "";
}

function parseAIJson(text) {
  try {
    // Loại bỏ các ký tự ```json và ``` nếu AI trả về định dạng Markdown
    const cleanJson = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("Lỗi parse JSON từ AI:", text);
    return {success: 'false', error: text};
  }
}

export const chatService = async (message, username) => {
  const question = typeof message === "string" ? message : message?.message;
  if (!question) return "Vui lòng nhập nội dung câu hỏi.";

  // Bước 1: Phân loại
  const intentRaw = await generateText(buildInputPrompt(question));
  const parsed = parseAIJson(intentRaw);
  if (parsed?.success === 'false'){
    return parsed.error;
  }
  // console.log('AI error', parsed);

  if (!parsed || !QUERY_TYPES[parsed.type] || parsed.type === QUERY_TYPES.UNKNOWN) {
    return "Tôi chưa hiểu ý bạn. Bạn muốn kiểm tra cảm biến, thiết bị hay thông tin cá nhân?";
  }

  // Bước 2: Lấy dữ liệu từ DB
  const data = await queryDB(parsed.type, username, parsed.target);

  if (!data) {
    return `Hiện tại tôi không tìm thấy dữ liệu về ${parsed.target || 'yêu cầu này'} trong hệ thống.`;
  }

  // Bước 3: Tạo câu trả lời tự nhiên
  const answerPrompt = `
    You are an intelligent assistant for a Smart Flood Monitoring and Warning System.

    Your task is to analyze the provided data and answer the user's question in Vietnamese, in a clear, concise, and accurate manner.

    Guidelines:

    The answer must be written in Vietnamese.

    When mentioning numerical values, include appropriate measurement units if applicable (for example: °C, %, cm, mm, m, m³/s).

    Only use the information from the provided DATA.

    Do not speculate or invent information.

    If the data is insufficient to answer the question, clearly state that there is not enough data.

    Keep the answer practical, easy to understand, and suitable for a flood monitoring system.

    Do not use markdown, emojis, or special formatting.

    DATA: ${JSON.stringify(data)}

    QUESTION: ${question}
  `;

  try {
    return await generateText(answerPrompt);
  } catch (err) {
    return "Có lỗi khi xử lý câu trả lời, nhưng dữ liệu ghi nhận được là: " + JSON.stringify(data);
  }
};