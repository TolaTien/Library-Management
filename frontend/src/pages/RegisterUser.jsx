import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestRegister } from '../config/request';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import imagesLogin from '../assets/images/login.webp';
import './RegisterUser.css';

// Reusable Components
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

function RegisterUser() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    typeLogin: 'email'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Vui lòng nhập họ tên!';
    }
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email!';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ!';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu!';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại!';
    }
    
    if (!formData.address) {
      newErrors.address = 'Vui lòng nhập địa chỉ!';
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

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await requestRegister(registerData);
      toast.success('Đăng ký thành công!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-layout">
      <header>
        <Header />
      </header>

      <main className="register-page__main">
        <div className="register-page__container">
          <div className="register-page__content-wrapper">
            <div className="register-page__image-column">
              <div className="register-page__image-wrapper">
                <img
                  src={imagesLogin}
                  alt="Đăng ký"
                  className="register-page__image"
                />
                <div className="register-page__image-overlay"></div>
              </div>
            </div>

            <div className="register-page__form-column">
              <div className="register-page__form-padding">
                <div className="register-page__form-header">
                  <h1 className="register-page__form-title">Đăng ký tài khoản</h1>
                  <p className="register-page__form-subtitle">Tạo tài khoản mới để sử dụng dịch vụ</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                  />

                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>}
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

                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                  />

                  <div className="register-page__optional-fields">
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>}
                    />

                    <Input
                      type="text"
                      name="address"
                      placeholder="Địa chỉ"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    variant="primary"
                  >
                    Đăng ký
                  </Button>

                  <div className="divider">
                    <span>Hoặc</span>
                  </div>

                  <div className="register-page__login-link">
                    <p className="register-page__login-text">Đã có tài khoản?</p>
                    <Link to="/login">
                      <Button variant="secondary">Đăng nhập ngay</Button>
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

export default RegisterUser;