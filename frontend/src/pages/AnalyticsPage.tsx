import AnalyticsForm from "../components/Analytics/AnalyticsForm";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const AnalyticsPage = () => {
  const [result, setResult] = useState<any>(null); // lưu kết quả phân tích (object)
  const auth = useAuth();

  const handleAnalytics = async (message: string) => {
    if (!auth.user) {
      setResult({ error: "Chưa đăng nhập" });
      return;
    }
    const idtoken = await auth.user?.getIdToken();
    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idtoken}`, // Gửi token trong header
      },
      body: JSON.stringify({ prompt: message }),
    });

    const data = await res.json();

    if (res.ok) {
      setResult(data); // lấy đúng trường analysis
    } else {
      setResult({ error: data.error || "Lỗi khi phân tích" });
    }
  };

  return (
    <div>
      <AnalyticsForm onAnalytic={handleAnalytics} />

      {/* Hiển thị kết quả phân tích nếu có */}
      {result && !result.error && (
        <div>
          <p><strong>Fake News:</strong> {result.isFakeNews ? "Có" : "Không"}</p>
          <p><strong>Độ tin cậy:</strong> {result.confidence}%</p>
          <p><strong>Lý do:</strong> {result.reason}</p>
          <p><strong>Dấu hiệu:</strong> {result.indicators?.join(", ")}</p>
          <p><strong>Khuyến nghị:</strong> {result.recommendation}</p>
        </div>
      )}

      {/* Hiển thị lỗi nếu có */}
      {result && result.error && <p style={{ color: "red" }}>{result.error}</p>}
    </div>
  );
};

export default AnalyticsPage;
