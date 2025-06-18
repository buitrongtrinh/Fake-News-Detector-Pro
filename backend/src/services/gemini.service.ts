import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { FactCheckResult } from "../types/interfaces";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const date = new Date().toLocaleDateString('vi-VN');

export async function callGeminiAPI(message: string): Promise<FactCheckResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: [
        `
Bạn là một chuyên gia xác minh thông tin. Kiểm tra tính chính xác của thông tin được cung cấp.

Ngày hiện tại: ${date} (múi giờ Việt Nam)

Xác minh **đoạn thông tin** hoặc **đoạn url** sau: "${message}"

JSON output:
{
  "input": "Nội dung kiểm tra",
  "isfakenews": "true/false/null",
  "reasoning": ["Lý do ngắn gọn, Không chèn số tham chiếu như [1], [2, 3] vào.", "lý do 2"],
  "sources": [
    {
      "title": "Tiêu đề bài báo",
      "url": "url bạn dùng search thông tin",
      "domain": "như Vnexpress.net không được trả về vertexaisearch.cloud.google.com",
      "date_published": "ngày đăng bài",
      "status": "supports/refutes"
    }
  ],
  "advice": "Lời khuyên cho người dùng về việc chia sẻ/tin tưởng thông tin này"
}

Quy tắc:
- "true" = tin giả/sai lệch
- "false" = tin thật/chính xác  
- "null" = chưa đủ thông tin
- Ưu tiên kiến thức có sẵn
- Những câu hỏi liên quan thời gian, hãy lấy thời gian ở Việt Nam ($${date})
- Khi search: search bài báo lớn, uy tín, gần với ngày hôm nay nhất
- Nếu search → bao gồm nguồn trong "sources"
- Chỉ search khi thực sự cần (tin mới/phức tạp)
- Advice: đưa ra khuyên nghị cho người muốn xác minh
        `
      ],
      config: {
        tools: [
          { urlContext: {} },
          { googleSearch: {} },
        ],
      },
    });

    if (!response.text) {
      throw new Error("Không có nội dung từ Gemini API.");
    }

    // Xử lý và parse JSON trả về
    const rawText = response.text.trim();
    const cleanedText = rawText
      .replace(/```json\n?/g, '')
      .replace(/```$/g, '')
      .trim();
    console.log(cleanedText);
    const result: FactCheckResult = JSON.parse(cleanedText);
    return result;

  } catch (error) {
    console.error("❌ Lỗi khi gọi Gemini API hoặc parse JSON:", error);

    // Trả về một object fallback
    return {
      input: "",
      isfakenews: "",
      reasoning: ["Không thể xác minh thông tin", "Lỗi khi gọi API hoặc phân tích dữ liệu"],
      sources: [],
      advice: "",
    }
  }
}