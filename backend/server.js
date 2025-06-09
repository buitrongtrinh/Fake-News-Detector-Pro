// backend/server.js
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());

// Route phân tích tin tức với Gemini
app.post("/api/analyze", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Vui lòng nhập nội dung cần phân tích"
      });
    }

    // Prompt cho Gemini để phân tích fake news
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

    // Gọi Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response từ Gemini
    let analysisResult;
    try {
      // Lấy JSON từ response (loại bỏ markdown nếu có)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Không thể parse JSON");
      }
    } catch (parseError) {
      // Nếu không parse được JSON, tạo response mặc định
      analysisResult = {
        isFakeNews: false,
        confidence: 50,
        reason: text.substring(0, 200) + "...",
        indicators: ["Cần phân tích thêm"],
        recommendation: "Hãy kiểm tra từ nhiều nguồn khác nhau"
      };
    }

    res.json({
      success: true,
      analysis: analysisResult,
      originalText: message
    });

  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    res.status(500).json({
      error: "Có lỗi xảy ra khi phân tích nội dung",
      details: error.message
    });
  }
});

// Route test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend đang hoạt động bình thường!",
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Route để lấy lịch sử phân tích (tạm thời lưu trong memory)
let analysisHistory = [];

app.get("/api/history", (req, res) => {
  res.json({
    success: true,
    history: analysisHistory
  });
});

// Middleware lưu lịch sử
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/api/analyze') {
    const originalJson = res.json;
    res.json = function (data) {
      if (data.success && data.analysis) {
        analysisHistory.unshift({
          id: Date.now(),
          text: data.originalText,
          result: data.analysis,
          timestamp: new Date().toISOString()
        });

        // Giữ tối đa 50 records
        if (analysisHistory.length > 50) {
          analysisHistory = analysisHistory.slice(0, 50);
        }
      }
      originalJson.call(this, data);
    };
  }
  next();
});

app.listen(port, () => {
  console.log(`✅ Backend đang chạy tại http://localhost:${port}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Đã cấu hình' : 'Chưa cấu hình'}`);
});