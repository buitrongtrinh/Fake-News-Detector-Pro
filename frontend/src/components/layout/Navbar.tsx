import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/components/Navbar.css';
import ProfilePopup from './ProfilePopup';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  

  const handleToggleProfile = () => setShowProfile((prev) => !prev);
  const handleCloseProfile = () => setShowProfile(false);
  const handleLogout = () => {
    auth?.logout(); // Gọi hàm logout từ AuthContext
    setShowProfile(false); // Tắt popup profile khi logout
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src="/logoSchool.png" alt="Logo School" className="navbar-logo"/>
        <Link to="/dashboard">Fake News Detector</Link>
      </div>

      <div className="navbar-center">
        <Link to="/about">Giới thiệu</Link>
        <Link to="/analysis">Phân tích</Link>
        <Link to="/history">Lịch sử</Link>
      </div>

      <div className="navbar-right">
        {!auth?.user?(
          // 👉 Gộp đăng ký & đăng nhập vào 1 div
          <div className="auth-links">
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </div>
        ) : (
          <div className="user-info">
              {/* Nút profile thay cho email */}
            <button onClick={handleToggleProfile} className="profile-btn">
              Profile
            </button>            
            {/* Popup Profile */}
            {showProfile && (
              <ProfilePopup
                user={auth.user || ''}
                onClose={handleCloseProfile}
              />
            )}
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
