// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";

// dotenv.config();

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export async function generateText(prompt) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });

//   console.log("GEMINI ANSWER");
//   console.log(response.text);

//   return response.text;
// }


import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateText(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Không có phản hồi từ hệ thống AI.";
  } catch (error) {
    // Log để debug, không throw tiếp
    // console.error("Gemini API error:", {
    //   status: error?.status,
    //   message: error?.message,
    // });

    // Xử lý riêng lỗi vượt quota
    if (error?.status === 429) {
      return (
        "Hệ thống AI đang tạm thời quá tải do vượt giới hạn sử dụng. " +
        "Dữ liệu giám sát vẫn hoạt động bình thường. " +
        "Vui lòng thử lại sau."
      );
    }

    // Lỗi khác
    return (
      "Không thể tạo phân tích từ AI tại thời điểm này. " +
      "Hệ thống giám sát vẫn đang hoạt động."
    );
  }
}
