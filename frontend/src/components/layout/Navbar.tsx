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
    auth?.logout();
    setShowProfile(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src="/logoSchool.png" alt="Logo School" className="navbar-logo" />
        <Link to="/about">Fake News Detector</Link>
      </div>

      <div className="navbar-center">
        {auth?.role === 'admin' && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/about">About</Link>
        <Link to="/analysis">Analyze</Link>
        <Link to="/history">History</Link>
      </div>

      <div className="navbar-right">
        {!auth?.user ? (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        ) : (
          <div className="user-info" style={{ position: 'relative' }}>
            <button onClick={handleToggleProfile} className="profile-btn">
              Profile
            </button>
            {showProfile && (
              <ProfilePopup user={auth.user} onClose={handleCloseProfile} />
            )}
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
