import LoginForm from '../components/auth/LoginForm';
import { login as Login } from '../services/firebase/firebaseAuth'; // hàm đăng nhập từ firebase
import { AuthContext } from '../context/AuthContext'; // context chứa thông tin đăng nhập
import { useNavigate } from 'react-router-dom';
import {  useContext } from 'react';

const LoginPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = async (email: string, password: string) => {
    // 1. Đăng nhập Firebase
    const user = await Login(email, password);
    
    // 2. Lấy ID token
    const idToken = await user?.getIdToken(); // Lấy ID token từ User nếu có
    console.log(idToken);
    // 3. Gửi token cho backend
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`, // Gửi token trong header
      },
      body: JSON.stringify({ email, password }), // Gửi email và mật khẩu
    });
    
    if (!res.ok) {
      throw new Error('Backend xác thực thất bại');
    }

    const data = await res.json();
    console.log('Backend login response:', data);

    // ✅ Chỉ sau khi backend xác nhận mới login vào context
    auth?.login(user, data.role);
    navigate('/dashboard');
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default LoginPage;
