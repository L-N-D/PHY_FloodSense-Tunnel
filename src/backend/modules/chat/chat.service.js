import { generateText } from "./geminiClient.service.js";
import User from "../user/user.model.js";

const QUERY_INTENTS = {
  USER: "USER",
  TEMPERATURE: "TEMPERATURE",
  WATER_LEVEL: "WATER_LEVEL",
  DEVICE_STATUS: "DEVICE_STATUS",
  SYSTEM_STATUS: "SYSTEM_STATUS",
  UNKNOWN: "UNKNOWN",
};

function buildIntentPrompt(question) {
  return `
You are an intent classifier.

RULES:
- Choose ONLY ONE intent
- Extract parameters if needed
- DO NOT explain
- DO NOT invent
- If not matched, return UNKNOWN

INTENTS:
- USER
- TEMPERATURE
- WATER_LEVEL
- DEVICE_STATUS
- SYSTEM_STATUS
- UNKNOWN

Respond ONLY in JSON.

FORMAT:
{
  "intent": "INTENT_NAME",
  "deviceName": "optional"
}

USER QUESTION:
${question}
`;
}

function buildAnswerPrompt(data, question) {
  return `
You are an IoT assistant.
Answer ONLY using the data below.
Do NOT make assumptions.

DATA:
${JSON.stringify(data, null, 2)}

USER QUESTION:
${question}
`;
}

async function queryDB(intent, userId, params = {}) {
  switch (intent) {
    case QUERY_INTENTS.USER: {
      const user = await User.findById(userId).lean();
      if (!user) return null;

      return {
        name: user.name,
        email: user.email,
        username: user.username,
      };
    }

    default:
      return null;
  }
}

export const chatService = async (message, userId) => {
  const question = message?.message || message;

  let intentRaw = "";
  try {
    intentRaw = await generateText(buildIntentPrompt(question));
  } catch (err) {
    console.error("Error generating intent:", err);
    return "AI hiện không khả dụng, vui lòng thử lại sau.";
  }

  console.log(intentRaw);

  let intent = QUERY_INTENTS.UNKNOWN;
  let params = {};

  try {
    const parsed = JSON.parse(intentRaw);
    if (QUERY_INTENTS[parsed.intent]) {
      intent = parsed.intent;
    }
    if (parsed.deviceName) {
      params.deviceName = parsed.deviceName;
    }
  } catch {
    intent = QUERY_INTENTS.UNKNOWN;
  }

  if (intent === QUERY_INTENTS.UNKNOWN) {
    return "Câu hỏi này hiện chưa được hỗ trợ.";
  }

  const data = await queryDB(intent, userId, params);
  if (!data) {
    return "Không tìm thấy dữ liệu phù hợp.";
  }

  let answer = "";
  try {
    answer = await generateText(buildAnswerPrompt(data, question));
  } catch (err) {
    console.error("Error generating answer:", err);
    return "AI hiện không khả dụng, vui lòng thử lại sau.";
  }

  return answer;
};

