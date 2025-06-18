import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../services/firebase/firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import "../styles/pages/HistoryPage.css";
import { FiChevronRight } from "react-icons/fi";

interface Source {
  title: string;
  url: string;
  domain: string;
  date_published: string;
  status: string;
}

interface HistoryEntry {
  id: string;
  input: string;
  isfakenews: string;
  reasoning: string[];
  sources: Source[];
  advice: string;
  createdAt: { seconds: number };
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("vi-VN");
};

const HistoryPage = () => {
  const { user, loading } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "history"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const entries: HistoryEntry[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HistoryEntry[];

        setHistory(entries);
      } catch (error) {
        console.error("❌ Firestore query error:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading || fetching) return <p>Đang tải lịch sử...</p>;
  if (!user) return <p>Bạn cần đăng nhập để xem lịch sử</p>;
  if (history.length === 0) return <p>Chưa có phân tích nào.</p>;

  const groupedByDate: { [date: string]: HistoryEntry[] } = {};
  history.forEach((entry) => {
    const date = formatDate(entry.createdAt.seconds);
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(entry);
  });

  return (
    <div className="history-container">
      <h2>Lịch sử phân tích của bạn</h2>
      {Object.entries(groupedByDate).map(([date, entries]) => (
        <div key={date} className="history-day-group">
          <h3>{date}</h3>
          {entries.map((item) => {
            const isExpanded = expanded[item.id] || false;

            return (
              <div
                key={item.id}
                className={`history-entry-summary ${
                  item.isfakenews === "true"
                    ? "history-result-true"
                    : item.isfakenews === "false"
                    ? "history-result-false"
                    : "history-result-null"
                }`}
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [item.id]: !prev[item.id],
                  }))
                }
              >
                <div className="history-entry-header">
                  <FiChevronRight
                    className={`expand-icon ${isExpanded ? "expanded" : ""}`}
                  />
                  <p>
                    <strong>Nội dung:</strong> {item.input}
                  </p>
                </div>

                {isExpanded && (
                  <div className="history-entry-details">
                    <p>
                      <strong>Kết luận:</strong>{" "}
                      {item.isfakenews === "true"
                        ? "Thông tin sai lệch"
                        : item.isfakenews === "false"
                        ? "Thông tin đáng tin cậy"
                        : "Chưa đủ căn cứ"}
                    </p>
                    <p><strong>Lý do:</strong></p>
                    <ul>
                      {item.reasoning.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                    <p><strong>Lời khuyên:</strong> {item.advice}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default HistoryPage;
