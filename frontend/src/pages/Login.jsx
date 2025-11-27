import { useState } from 'react';
import { Button, Form, Input, Card, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { requestLogin } from '../config/request';
import { toast } from 'react-toastify';
import imagesLogin from '../assets/images/login.webp';
// Import file CSS riêng
import './Login.css';

function LoginUser() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { email, password } = values;

        // ✅ Nếu là tài khoản admin thì bỏ qua backend và chuyển hướng ngay
        if (email === 'admin@gmail.com' && password === '123456') {
            toast.success('Đăng nhập admin thành công!');
            navigate('/admin');
            return;
        }

        // ✅ Các tài khoản khác vẫn gọi API bình thường
        setLoading(true);
        try {
            await requestLogin(values);
            toast.success('Đăng nhập thành công!');
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Đăng nhập thất bại!');
            setLoading(false);
        }
    };

    return (
        // BEM: login-page-layout
        <div className="login-page-layout">
            <header>
                <Header />
            </header>

            {/* BEM: login-page__main */}
            <main className="login-page__main">
                <div className="login-page__container">
                    {/* BEM: login-page__content-wrapper */}
                    <div className="login-page__content-wrapper">
                        {/* Phần hình ảnh */}
                        {/* BEM: login-page__image-column */}
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

                        {/* Phần form đăng nhập */}
                        {/* BEM: login-page__form-column */}
                        <div className="login-page__form-column">
                            <div className="login-page__form-padding">
                                <div className="login-page__form-header">
                                    <h1 className="login-page__form-title">Chào mừng trở lại</h1>
                                    <p className="login-page__form-subtitle">Đăng nhập vào tài khoản của bạn</p>
                                </div>

                                <Form
                                    name="login_form"
                                    className="login-form"
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    layout="vertical"
                                    size="large"
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                                    >
                                        {/* BEM: login-page__input-prefix */}
                                        <Input
                                            prefix={<UserOutlined className="login-page__input-prefix" />}
                                            placeholder="Email"
                                            className="login-page__input"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="login-page__input-prefix" />}
                                            placeholder="Mật khẩu"
                                            className="login-page__input"
                                        />
                                    </Form.Item>

                                    {/* BEM: login-page__forgot-password */}
                                    <div className="login-page__forgot-password">
                                        <Link className="login-page__forgot-password-link" to="/forgot-password">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            // BEM: login-page__button
                                            className="login-page__button login-page__button--login"
                                            loading={loading}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>

                                    <Divider plain className="login-page__divider">Hoặc</Divider>

                                    {/* BEM: login-page__register-link */}
                                    <div className="login-page__register-link">
                                        <Link to="/register">
                                            <Button className="login-page__button login-page__button--register">Đăng ký</Button>
                                        </Link>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
            
            {/* Style cho text trên ảnh (sẽ chuyển sang CSS file) */}
            <style jsx>{`
                .login-page__welcome-title {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
}

export default LoginUser;