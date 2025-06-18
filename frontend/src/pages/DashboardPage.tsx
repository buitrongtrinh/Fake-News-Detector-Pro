import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/pages/DashboardPage.css";

interface HistoryEntry {
  id: string;
  input: string;
  isfakenews: string | null;
  reasoning: string[];
  sources: any[];
  advice: string;
}

interface UserWithHistory {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLogin: string;
  history: HistoryEntry[];
  role: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<UserWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"user" | "admin">("user");

  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.user;
        if (!user) throw new Error("Not authenticated");
        const token = await user.getIdToken();

        const response = await fetch("http://localhost:5000/admin/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Something went wrong");
        }

        const res = await response.json();
        setData(res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.user]);

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;

    try {
      const token = await auth.user?.getIdToken();
      const res = await fetch(`http://localhost:5000/admin/users/${uid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(111111111111, res);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Không thể xóa người dùng.");
      }

      setData((prev) => prev.filter((u) => u.uid !== uid));
      alert("✅ Đã xóa người dùng.");
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  // Function to get status info based on isfakenews value
  const getStatusInfo = (isfakenews: string | null) => {
    if (isfakenews === "false") {
      return {
        text: "Đáng tin cậy",
        className: "status-reliable",
        icon: "✅"
      };
    } else if (isfakenews === "true") {
      return {
        text: "Thông tin sai lệch", 
        className: "status-fake",
        icon: "❌"
      };
    } else {
      return {
        text: "Chưa xác định",
        className: "status-unknown", 
        icon: "❓"
      };
    }
  };

  const filteredData = data.filter((u) => u.role === selectedTab);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bảng điều khiển Admin</h1>

      {/* Tabs */}
      <div className="tab-buttons">
        <button
          className={selectedTab === "user" ? "active" : ""}
          onClick={() => setSelectedTab("user")}
        >
          👥 Người dùng
        </button>
        <button
          className={selectedTab === "admin" ? "active" : ""}
          onClick={() => setSelectedTab("admin")}
        >
          🛡️ Admin
        </button>
      </div>

      {/* User List */}
      {filteredData.length === 0 ? (
        <p className="text-sm italic">Không có người dùng thuộc nhóm này.</p>
      ) : (
        filteredData.map((user) => {
          const isCurrentUser = user.uid === auth.user?.uid;

          return (
            <div
              key={user.uid}
              className={`user-card mb-6 ${
                isCurrentUser ? "highlight-current-user" : ""
              }`}
            >
              <h2 className="text-lg font-semibold">
                👤 {user.displayName || user.email}{" "}
                <span className="text-sm text-gray-500">({user.role})</span>
                {isCurrentUser && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                    Bạn
                  </span>
                )}
                {user.role === "user" && !isCurrentUser && (
                  <button
                    onClick={() => handleDeleteUser(user.uid)}
                    className="ml-4 text-sm text-red-600 hover:underline"
                  >
                    ❌ Xóa
                  </button>
                )}
              </h2>
              <p className="text-sm text-gray-500">
                Đăng ký: {new Date(user.createdAt).toLocaleString()} | Đăng nhập:{" "}
                {new Date(user.lastLogin).toLocaleString()}
              </p>

              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">Xem lịch sử phân tích</summary>
                {user.history.length === 0 ? (
                  <p className="text-sm italic mt-2">Không có dữ liệu</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {user.history.map((entry) => {
                      const statusInfo = getStatusInfo(entry.isfakenews);
                      
                      return (
                        <li key={entry.id} className={`history-entry ${statusInfo.className}`}>
                          <p className="font-medium">🔍 {entry.input}</p>
                          <p className="text-sm">
                            Kết luận:{" "}
                            <span className="status-text">
                              {statusInfo.icon} {statusInfo.text}
                            </span>
                          </p>

                          <div className="reasoning-list mt-1">
                            <p className="font-medium">Lý do:</p>
                            <ul className="list-disc list-inside">
                              {entry.reasoning.map((reason, index) => (
                                <li key={index}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </details>
            </div>
          );
        })
      )}
    </div>
  );
}