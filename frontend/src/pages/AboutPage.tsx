import '../styles/pages/AboutPage.css';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1>Giới thiệu về dự án Fake News Detector</h1>
      <p>
        Đây là dự án nhằm hỗ trợ người dùng phân tích và phát hiện tin tức giả mạo bằng công nghệ AI hiện đại.
        Chúng tôi sử dụng Firebase để quản lý đăng nhập, tìm kiếm thông tin liên quan và dùng Gemini API để phân tích nội dung.
      </p>
      <h2>Cách sử dụng</h2>
      <ol>
        <li>
          <Link to="/login">Đăng nhập</Link>{' '}nếu đã có tài khoản, chưa có nhấn{' '}
          <Link to="/register">đăng ký</Link>
        </li>
        <li>Vào phần <Link to="/analysis">Analyze</Link>, nhập đoạn văn hoặc đường link tin tức cần phân tích.</li>
        <li>Bấm nút "Phân tích".</li>
        <li>Đọc kết quả và các đánh giá liên quan đến độ tin cậy của tin tức.</li>
      </ol>
      <h2>Chính sách bảo mật</h2>
      <p>
        Chúng tôi cam kết bảo vệ dữ liệu cá nhân của người dùng và không chia sẻ với bên thứ ba.
      </p>
    </div>
  );
};

export default AboutPage;