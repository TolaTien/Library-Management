import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestRegister } from '../config/request';
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
    
    if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên!';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email!';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ!';

    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu!';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu!';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';

    if (!formData.phone) newErrors.phone = 'Vui lòng nhập số điện thoại!';
    if (!formData.address) newErrors.address = 'Vui lòng nhập địa chỉ!';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      setTimeout(() => window.location.reload(), 1000);
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-layout auth-page--register">
      <header>
        <Header />
      </header>

      <main className="auth-page__main">
        <div className="auth-page__container">
          <div className="auth-page__content-wrapper">
            <div className="auth-page__form-column">
              <div className="auth-page__form-padding">
                <div className="auth-page__form-header">
                  <h1 className="auth-page__form-title">Đăng ký tài khoản</h1>
                  <p className="auth-page__form-subtitle">Tạo tài khoản mới để sử dụng dịch vụ</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                  />

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

                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                  />

                  <div className="auth-page__optional-fields">
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                    />

                    <Input
                      type="text"
                      name="address"
                      placeholder="Địa chỉ"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                    />
                  </div>

                  <Button type="submit" loading={loading} variant="primary">
                    Đăng ký
                  </Button>

                  <div className="divider">
                    <span>Hoặc</span>
                  </div>

                  <div className="auth-page__footer-link">
                    <p className="auth-page__footer-text">Đã có tài khoản?</p>
                    <Link to="/login">
                      <Button variant="secondary">Đăng nhập ngay</Button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            <div className="auth-page__image-column">
              <div className="auth-page__image-wrapper">
                <img
                  src={imagesLogin}
                  alt="Đăng ký"
                  className="auth-page__image"
                />
                <div className="auth-page__image-overlay"></div>
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