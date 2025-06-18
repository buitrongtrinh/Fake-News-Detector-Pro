import React, { useState } from 'react';
import '../../styles/components/LoginForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Không được để trống thông tin đăng nhập.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ. Vui lòng nhập đúng định dạng email.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="text"
            className="form-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mật khẩu:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input password-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
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

        <button
          type="submit"
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
