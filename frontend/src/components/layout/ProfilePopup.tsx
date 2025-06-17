import React from 'react';
import '../../styles/components/ProfilePopup.css';
import type { User } from 'firebase/auth';

interface ProfilePopupProps {
  user: User | null;
  onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ user, onClose }) => {
  return (
    <div className="profile-popup">
      <div className="popup-content">
        <p><strong>Email:</strong> {user?.email || 'Chưa có'}</p>
        <p><strong>User name:</strong> {user?.displayName || 'Không rõ'}</p>
        <p><strong>Role:</strong> {localStorage.getItem('userRole') || 'Không rõ'}</p>
        <button onClick={onClose} className="close-btn">Đóng</button>
      </div>
    </div>
  );
};

export default ProfilePopup;
