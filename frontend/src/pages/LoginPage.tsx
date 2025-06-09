import LoginForm from '../components/auth/LoginForm';
import { login } from '../services/firebaseAuth'; // hàm đăng nhập từ firebase
import { AuthContext } from '../context/AuthContext'; // context chứa thông tin đăng nhập
import { useNavigate } from 'react-router-dom';
import {  useContext } from 'react';

const LoginPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login(email, password); // Nhận lại User
      if (user) {
        // Nếu đăng nhập thành công, lưu thông tin User vào context
        auth?.login(user) // truyền vào context
        
        navigate('/dashboard');   // chuyển sang dashboard
      }
    } catch (error) {
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'); // Thông báo lỗi nếu đăng nhập không thành công
    }
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default LoginPage;
