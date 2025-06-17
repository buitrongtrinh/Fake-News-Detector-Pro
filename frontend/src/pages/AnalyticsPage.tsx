// src/pages/AnalyticsPage.tsx
import AnalyticsForm from "../components/Analytics/AnalyticsForm";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/pages/AnalyticsPage.css";

interface Source {
  title: string,
  url: string;
  domain: string;
  date_published: string;
  status: "supports" | "refutes";
}

interface FactCheckResult {
  input: string;
  isfakenews: "true" | "false" | "null" | "";
  reasoning: string[];
  sources: Source[];
  advice: String;
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
          className={`analytics-result-box ${
            result.isfakenews === "false" 
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
            <p>
              <span className="analytics-label">Lý do:</span> {result.reasoning}
            </p>
          </div>

          <div className="analytics-section">
            <p>
              <span className="analytics-label">Lời khuyên:</span> {result.advice}
            </p>
          </div>

          {result.sources?.length > 0 && (
            <div className="analytics-section">
              <p className="analytics-label">Bằng chứng từ các nguồn:</p>
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
