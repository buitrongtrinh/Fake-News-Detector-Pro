import React from "react";
import "../../styles/components/AnalyticsForm.css";

interface AnalyticsFormProps {
  onAnalytic: (data: string) => Promise<void>;
}

const AnalyticsForm: React.FC<AnalyticsFormProps> = ({ onAnalytic }) => {
  const [data, setData] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.trim()) {
      setError("Vui lòng nhập dữ liệu phân tích.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onAnalytic(data.trim());
      setData("");
    } catch {
      setError("Lỗi khi gửi dữ liệu phân tích. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
    if (error) setError(null);
  };

  const handleAutoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    const maxHeight = 200;
    const newHeight = Math.min(target.scrollHeight, maxHeight);
    target.style.height = `${newHeight}px`;
    target.style.overflowY = target.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const handleWheel = (e: React.WheelEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;
    if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
      e.stopPropagation();
    }
  };

  return (
    <div className="analytics-form-container">
      <form className="analytics-form" onSubmit={handleSubmit}>
        <h2>Phân tích Dữ liệu</h2>

        <div className="form-group">
          <label htmlFor="data">Dữ liệu phân tích</label>
          <textarea
            id="data"
            value={data}
            onChange={handleInputChange}
            onInput={handleAutoResize}
            onWheel={handleWheel}
            placeholder="Nhập dữ liệu cần phân tích..."
            className={error ? "error" : ""}
            disabled={loading}
            rows={1}
            style={{ resize: "none" }}
          />
          {error && <div className="error-message">{error}</div>}
        </div>

        <button
          type="submit"
          disabled={loading || !data.trim()}
          className={loading ? "loading" : ""}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Đang xử lý...
            </>
          ) : (
            "Gửi Dữ liệu"
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalyticsForm;
