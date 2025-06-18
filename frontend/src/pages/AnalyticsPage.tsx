// src/pages/AnalyticsPage.tsx
import AnalyticsForm from "../components/Analytics/AnalyticsForm";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/pages/AnalyticsPage.css";
import { db } from "../services/firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

interface Source {
  title: string,
  url: string;
  domain: string;
  date_published: string;
  status: string;
}

interface FactCheckResult {
  input: string;
  isfakenews: string;
  reasoning: string[];
  sources: Source[];
  advice: string;
}
const AnalyticsPage = () => {
  const [result, setResult] = useState<FactCheckResult | { error: string } | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const auth = useAuth();

  const handleAnalytics = async (message: string) => {
    if (!auth.user) {
      setResult({ error: "Chưa đăng nhập" });
      return;
    }

    setResult(null);
    const startTime = performance.now();
    try {
      const idtoken = await auth.user.getIdToken();
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idtoken}`,
        },
        body: JSON.stringify({ prompt: message }),
      });
      const endTime = performance.now();
      const duration = Math.round((endTime - startTime) / 10) / 100;
      setDuration(duration);
      const data = await res.json();
      if (res.ok) {
        setResult(data);

        // 👉 Thêm console log để kiểm tra dữ liệu trước khi lưu Firestore
        const historyData = {
          userId: auth.user.uid,
          userEmail: auth.user.email,
          input: data.input,
          isfakenews: data.isfakenews,
          reasoning: data.reasoning,
          sources: data.sources,
          advice: data.advice,
          createdAt: Timestamp.now(),
        };

        console.log("Dữ liệu chuẩn bị lưu vào Firestore:", historyData);

        try {
          await addDoc(collection(db, "history"), historyData);
          console.log("✅ Đã lưu thành công vào Firestore");
        } catch (err) {
          console.error("❌ Lỗi khi lưu Firestore:", err);
        }
      } else {
        setResult({ error: data.error || "Lỗi khi phân tích" });
      }
    } catch (error) {
      setResult({ error: "Lỗi kết nối đến server" });
    }
  };

  return (
    <div className="analytics-container">
      <AnalyticsForm onAnalytic={handleAnalytics} />

      {result && !("error" in result) && (
        <section
          className={`analytics-result-box ${result.isfakenews === "false"
            ? "analytics-result-false"
            : result.isfakenews === "true" ? "analytics-result-true"
              : "analytics-result-null"
            }`}
        >
          <p>Thời gian phân tích: {duration} giây</p>

          <h3>Kết quả phân tích</h3>

          <div className="analytics-section">
            <p>
              <span className="analytics-label">Nội dung kiểm tra:</span> {result.input}
            </p>
          </div>

          <div className="analytics-section">
            <p>
              <span className="analytics-label">Kết luận:</span>{" "}
              <span
                className={
                  result.isfakenews === "true"
                    ? "isfakenews-true"
                    : result.isfakenews === "false"
                      ? "isfakenews-false"
                      : "isfakenews-null"
                }
              >
                {result.isfakenews === "true"
                  ? "Thông tin sai lệch"
                  : result.isfakenews === "false"
                    ? "Thông tin đáng tin cậy"
                    : "Chưa đủ căn cứ để xác minh"}
              </span>
            </p>
          </div>
          <div className="analytics-section">
            <p className="analytics-label">Lý do:</p>
            <ul>
              {result.reasoning.map((reason: string, index: number) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="analytics-section">
            <p>
              <span className="analytics-label">Lời khuyên:</span> {result.advice}
            </p>
          </div>

          {result.sources?.length > 0 && (
            <div className="analytics-section">
              <p className="analytics-label">Các nguồn tham khảo:</p>
              {result.sources.map((source, index) => (
                <div key={index} className="evidence-block">
                  <p>
                    <span className="analytics-label">Nguồn:</span> {source.domain}
                  </p>
                  <p>
                    <span className="analytics-label">Link:</span>{" "}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title}
                    </a>
                  </p>
                  <p>
                    <span className="analytics-label">
                      Ngày đăng: {source.date_published ? source.date_published : "Không rõ"}
                    </span>
                  </p>
                  <p>
                    <span className="analytics-label">Trạng thái:</span>{" "}
                    <span
                      className={
                        source.status === "supports"
                          ? "evidence-supports"
                          : "evidence-refutes"
                      }
                    >
                      {source.status === "supports"
                        ? "Khớp với thông tin bài báo"
                        : "Không khớp thông tin bài báo"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {result && "error" in result && (
        <div className="analytics-error">
          <p>
            <span className="analytics-label">Lỗi:</span> {result.error}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
