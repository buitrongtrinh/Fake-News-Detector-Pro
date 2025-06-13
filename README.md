
# 📰 Fake-News-Detector-Pro

**Fake-News-Detector-Pro** là một ứng dụng web hỗ trợ phát hiện và phân tích tin giả từ **văn bản** hoặc **URL**. Ứng dụng kết hợp trí tuệ nhân tạo (Gemini AI) và công cụ tìm kiếm Google để kiểm tra độ chính xác và độ tin cậy của thông tin.

---

## 🔧 Tính năng nổi bật

- Phân tích văn bản hoặc URL để xác định mức độ tin cậy.
- Sử dụng AI (Gemini) để phân tích nội dung và kiểm tra thông tin.
- Tích hợp Google Search để xác minh nguồn.
- Lưu trữ lịch sử phân tích gần đây (tối đa 50 mục).
- Hỗ trợ thêm ghi chú và xuất dữ liệu lịch sử.

---

## 🚀 Cách chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/your-username/Fake-News-Detector-Pro.git
cd Fake-News-Detector-Pro
```

### 2. Cài đặt dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Cấu hình backend

- **Tạo file `.env`** trong thư mục `backend` dựa trên mẫu `.env.example`. Điền các API Key cần thiết (Gemini, Google Search API, v.v.).
- **Thêm file cấu hình Firebase Admin**:
  - Đặt file `FIREBASE_SERVICE_ACCOUNT` vào thư mục `backend/src/`.
  - Đảm bảo thông tin trong file phù hợp với project Firebase của bạn.

### 4. Chạy toàn bộ ứng dụng (backend + frontend)

```bash
npm run dev
```

> Lệnh này sẽ khởi chạy đồng thời cả frontend (React + Vite) và backend (Express) trong môi trường phát triển.

---
