import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { register } from '../services/firebase/firebaseAuth'; // hàm đăng ký từ firebase
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const handleRegister = async (email: string, password: string, username: string) => {
    const user = await register(email, password, username); //

    if (auth) {
      auth.login(user, 'user'); // truyền vào context

      navigate('/dashboard');   // chuyển sang dashboard
    }

  };

  return (
    <RegisterForm onRegister={handleRegister} />
  );
};

export default RegisterPage;
