import React, { useState, useEffect } from 'react';
import '../../styles/components/RegisterForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface RegisterFormProps {
  onRegister: (email: string, password: string, username: string) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationState, setValidationState] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false
  });

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidationState({
      email: email.length > 0 && emailRegex.test(email),
      username: username.length >= 3,
      password: password.length >= 6,
      confirmPassword: confirmPassword.length > 0 && password === confirmPassword
    });
  }, [email, username, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !username || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    if (username.length < 3) {
      setError('Tên người dùng phải có ít nhất 3 ký tự');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await onRegister(email, password, username);
    } catch {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng ký</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="text"
            className={`form-input ${validationState.email ? 'valid' : ''}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tên người dùng:</label>
          <input
            type="text"
            className={`form-input ${validationState.username ? 'valid' : ''}`}
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nhập Username (tối thiểu 3 ký tự)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mật khẩu:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-input password-input ${validationState.password ? 'valid' : ''}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Xác nhận mật khẩu:</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`form-input password-input ${validationState.confirmPassword ? 'valid' : confirmPassword.length > 0 ? 'invalid' : ''}`}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="form-button" 
          disabled={loading}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;