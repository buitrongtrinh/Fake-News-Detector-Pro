import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/components/UnauthorizedPage.css';

const UnauthorizedPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Redirect dựa theo role hoặc về dashboard mặc định
    if (auth?.user) {
      navigate('/dashboard'); // User về trang dashboard
    } else {
      navigate('/login'); // Nếu chưa đăng nhập thì về login
    }
  };

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        {/* Header Section */}
        <div className="unauthorized-header">
          <span className="unauthorized-icon">🚫</span>
          <h1 className="unauthorized-title">
            Không có quyền truy cập
          </h1>
          <p className="unauthorized-subtitle">
            Bạn không có quyền truy cập vào trang này.
          </p>
        </div>

        {/* Info Section */}
        <div className="unauthorized-info">
          <div className="info-item">
            <span className="info-label">Tài khoản hiện tại:</span>
            <span className="info-value">{auth?.user?.email || 'Chưa đăng nhập'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Tên hiển thị:</span>
            <span className="info-value">{auth?.user?.displayName || 'Chưa cập nhật'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Trạng thái:</span>
            <span className="info-value">{auth?.user ? 'Đã đăng nhập' : 'Chưa đăng nhập'}</span>
          </div>

          <div className="info-requirement">
            <strong>Lưu ý:</strong> Trang này yêu cầu quyền truy cập đặc biệt hoặc bạn cần đăng nhập để tiếp tục.
          </div>
        </div>

        {/* Actions Section */}
        <div className="unauthorized-actions">
          <button
            onClick={handleGoBack}
            className="unauthorized-btn btn-primary"
          >
            Quay lại trang chính
          </button>
          
          {auth?.user && (
            <button
              onClick={handleLogout}
              className="unauthorized-btn btn-secondary"
            >
              Đăng xuất
            </button>
          )}
          
          {!auth?.user && (
            <button
              onClick={() => navigate('/login')}
              className="unauthorized-btn btn-secondary"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;