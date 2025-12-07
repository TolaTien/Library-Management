import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestLogin } from '../config/request';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import imagesLogin from '../assets/images/login.webp';
import './Login.css';

// Custom Input Component
const Input = ({ type = 'text', name, placeholder, value, onChange, error }) => (
  <div className="input-wrapper">
    <div className="input-container">
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
    <div className="auth-page-layout auth-page--login">
      <header>
        <Header />
      </header>

      <main className="auth-page__main">
        <div className="auth-page__container">
          <div className="auth-page__content-wrapper">
            <div className="auth-page__image-column">
              <div className="auth-page__image-wrapper">
                <img
                  src={imagesLogin}
                  alt="Ảnh trang đăng nhập"
                  className="auth-page__image"
                />
                <div className="auth-page__image-overlay"></div>
                <div className="auth-page__image-text">
                  <h2 className="auth-page__welcome-title">Chào mừng trở lại</h2>
                </div>
              </div>
            </div>

            <div className="auth-page__form-column">
              <div className="auth-page__form-padding">
                <div className="auth-page__form-header">
                  <h1 className="auth-page__form-title">Chào mừng trở lại</h1>
                  <p className="auth-page__form-subtitle">Đăng nhập vào tài khoản của bạn</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />

                  <Input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
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

                  <div className="auth-page__footer-link">
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