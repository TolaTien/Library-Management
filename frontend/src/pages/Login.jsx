import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestLogin } from '../config/request';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import imagesLogin from '../assets/images/login.webp';
import './Login.css';

// Custom Input Component
const Input = ({ type = 'text', name, placeholder, value, onChange, icon, error }) => (
  <div className="input-wrapper">
    <div className="input-container">
      {icon && <span className="input-icon">{icon}</span>}
      <input
        type={type}
        name={name}
        className={`custom-input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
    {error && <span className="error-message">{error}</span>}
  </div>
);

// Custom Button Component
const Button = ({ children, onClick, loading, type = 'button', variant = 'primary', disabled }) => (
  <button
    type={type}
    className={`custom-button custom-button--${variant}`}
    onClick={onClick}
    disabled={loading || disabled}
  >
    {loading ? <span className="button-spinner"></span> : children}
  </button>
);

function LoginUser() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email!';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ!';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu!';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (formData.email === 'admin@gmail.com' && formData.password === '123456') {
      toast.success('Đăng nhập admin thành công!');
      navigate('/admin');
      return;
    }

    setLoading(true);
    try {
      await requestLogin(formData);
      toast.success('Đăng nhập thành công!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-layout">
      <header>
        <Header />
      </header>

      <main className="login-page__main">
        <div className="login-page__container">
          <div className="login-page__content-wrapper">
            <div className="login-page__image-column">
              <div className="login-page__image-wrapper">
                <img
                  src={imagesLogin}
                  alt="Tour du lịch"
                  className="login-page__image"
                />
                <div className="login-page__image-overlay"></div>
                <div className="login-page__image-text">
                  <h2 className="login-page__welcome-title">Chào mừng trở lại</h2>
                </div>
              </div>
            </div>

            <div className="login-page__form-column">
              <div className="login-page__form-padding">
                <div className="login-page__form-header">
                  <h1 className="login-page__form-title">Chào mừng trở lại</h1>
                  <p className="login-page__form-subtitle">Đăng nhập vào tài khoản của bạn</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                  />

                  <Input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    variant="primary"
                  >
                    Đăng nhập
                  </Button>

                  <div className="divider">
                    <span>Hoặc</span>
                  </div>

                  <div className="login-page__register-link">
                    <Link to="/register">
                      <Button variant="secondary">Đăng ký</Button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default LoginUser;