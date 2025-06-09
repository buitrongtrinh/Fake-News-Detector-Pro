// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/analyze", (req, res) => {
  const { message } = req.body;
  const greetings = ["hello", "hi", "xin chào", "chào", "hey"];

  const isGreeting = greetings.some((word) =>
    message.toLowerCase().includes(word)
  );

  res.json({
    result: isGreeting ? "✅ Đây là lời chào!" : "❌ Không phải lời chào.",
  });
});

app.listen(port, () => {
  console.log(`✅ Backend đang chạy tại http://localhost:${port}`);
});
