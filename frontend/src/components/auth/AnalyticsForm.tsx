import React from "react";

interface AnalyticsFormProps {
    onAnalytic: (data: string) => Promise<void>;
}

const AnalyticsForm: React.FC<AnalyticsFormProps> = ({ onAnalytic }) => {
    const [data, setData] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) {
            alert("Vui lòng nhập dữ liệu phân tích.");
            return;
        }
        setLoading(true);
        try {
            await onAnalytic(data);
            setData(""); // Reset input after submission
        } catch (error) {
            alert("Lỗi khi gửi dữ liệu phân tích. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Phân tích Dữ liệu</h2>
            <label htmlFor="data">Dữ liệu:</label>
            <input
                type="text"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Nhập dữ liệu phân tích"
            />
            <button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Gửi Dữ liệu"}
            </button>
        </form>
    );
}
export default AnalyticsForm;