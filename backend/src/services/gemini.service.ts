import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface AnalysisResult {
  isFakeNews: boolean;
  confidence: number;
  reason: string;
  indicators: string[];
  recommendation: string;
}

/**
 * Gọi Gemini API để phân tích nội dung tin tức
 * @param message Nội dung cần phân tích
 * @returns Kết quả phân tích dưới dạng JSON
 */
export const callGeminiAPI = async (message: string): Promise<AnalysisResult> => {
  const prompt = `
    Bạn là một chuyên gia phân tích tin tức. Hãy phân tích đoạn văn bản sau và xác định:
    1. Đây có phải là tin giả (fake news) không?
    2. Mức độ tin cậy (từ 0-100%)
    3. Lý do tại sao bạn đưa ra kết luận này
    4. Các dấu hiệu nhận biết

    Văn bản cần phân tích: "${message}"

    Trả lời theo định dạng JSON:
    {
      "isFakeNews": true/false,
      "confidence": số từ 0-100,
      "reason": "lý do chi tiết",
      "indicators": ["dấu hiệu 1", "dấu hiệu 2"],
      "recommendation": "khuyến nghị cho người đọc"
    }
  `;
  console.log("Gọi đến Gemini...");
  const result = await model.generateContent(prompt);
  console.log("Đã có result."); // nếu không in ra => bị treo
  const response = result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as AnalysisResult;
    } else {
      throw new Error("Không thể parse JSON từ Gemini");
    }
  } catch (error) {
    // Nếu không parse được, trả về kết quả mặc định
    return {
      isFakeNews: false,
      confidence: 50,
      reason: text.substring(0, 200) + "...",
      indicators: ["Cần phân tích thêm"],
      recommendation: "Hãy kiểm tra từ nhiều nguồn khác nhau"
    };
  }
};
