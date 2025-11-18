import { useState } from 'react';
import { Button, Form, Input, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestRegister } from '../config/request';
import { toast } from 'react-toastify';
import imagesLogin from '../assets/images/login.webp';
// Import file CSS riêng
import './RegisterUser.css';

function RegisterUser() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        // Kiểm tra mật khẩu xác nhận (Ant Design Form đã làm phần này, nhưng giữ lại logic kiểm tra kép)
        if (values.password !== values.confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp!');
            setLoading(false);
            return;
        }

        try {
            // Loại bỏ confirmPassword trước khi gửi request
            const { confirmPassword, ...registerData } = values;
            await requestRegister(registerData);
            toast.success('Đăng ký thành công!');
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            // Sử dụng Optional Chaining để xử lý lỗi tốt hơn
            toast.error(error.response?.data?.message || 'Đăng ký thất bại!'); 
            setLoading(false);
        }
    };

    return (
        // BEM: register-page-layout
        <div className="register-page-layout">
            <header>
                <Header />
            </header>

            {/* BEM: register-page__main */}
            <main className="register-page__main">
                <div className="register-page__container">
                    {/* BEM: register-page__content-wrapper */}
                    <div className="register-page__content-wrapper">
                        {/* Phần hình ảnh */}
                        {/* BEM: register-page__image-column */}
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

                        {/* Phần form đăng ký */}
                        {/* BEM: register-page__form-column */}
                        <div className="register-page__form-column">
                            <div className="register-page__form-padding">
                                <div className="register-page__form-header">
                                    <h1 className="register-page__form-title">Đăng ký tài khoản</h1>
                                    <p className="register-page__form-subtitle">Tạo tài khoản mới để sử dụng dịch vụ</p>
                                </div>

                                <Form
                                    name="register_form"
                                    className="register-form"
                                    initialValues={{ typeLogin: 'email' }}
                                    onFinish={onFinish}
                                    layout="vertical"
                                    size="large"
                                >
                                    <Form.Item
                                        name="fullName"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="register-page__input-prefix" />}
                                            placeholder="Họ và tên"
                                            className="register-page__input"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email!' },
                                            { type: 'email', message: 'Email không hợp lệ!' },
                                        ]}
                                    >
                                        <Input
                                            prefix={<MailOutlined className="register-page__input-prefix" />}
                                            placeholder="Email"
                                            className="register-page__input"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="register-page__input-prefix" />}
                                            placeholder="Mật khẩu"
                                            className="register-page__input"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirmPassword"
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="register-page__input-prefix" />}
                                            placeholder="Xác nhận mật khẩu"
                                            className="register-page__input"
                                        />
                                    </Form.Item>

                                    {/* BEM: register-page__optional-fields */}
                                    <div className="register-page__optional-fields">
                                        <Form.Item name="phone">
                                            <Input
                                                prefix={<PhoneOutlined className="register-page__input-prefix" />}
                                                placeholder="Số điện thoại (không bắt buộc)"
                                                className="register-page__input"
                                            />
                                        </Form.Item>

                                        <Form.Item name="address">
                                            <Input
                                                prefix={<HomeOutlined className="register-page__input-prefix" />}
                                                placeholder="Địa chỉ (không bắt buộc)"
                                                className="register-page__input"
                                            />
                                        </Form.Item>
                                    </div>

                                    <Form.Item name="typeLogin" hidden>
                                        <Input type="hidden" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="register-page__button register-page__button--register"
                                            loading={loading}
                                        >
                                            Đăng ký
                                        </Button>
                                    </Form.Item>

                                    <Divider plain className="register-page__divider">Hoặc</Divider>

                                    {/* BEM: register-page__login-link */}
                                    <div className="register-page__login-link">
                                        <p className="register-page__login-text">Đã có tài khoản?</p>
                                        <Link to="/login">
                                            <Button className="register-page__button register-page__button--login">Đăng nhập ngay</Button>
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
        </div>
    );
}

export default RegisterUser;