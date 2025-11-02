import { useState } from 'react';
import { Button, Form, Input, message, Card, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Footer from '../components/Footer';
import Header from '../components/Header';
// Import file CSS riêng
import './ForgotPassword.css';

function ForgotPassword() {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);

    // Bước 1: Gửi email (giả lập)
    const handleEmailSubmit = async (values) => {
        setLoading(true);
        setTimeout(() => {
            message.success(`Link reset mật khẩu đã được gửi tới ${values.email} `);
            setIsEmailSent(true);
            setLoading(false);
        }, 1000);
    };

    // Bước 2: Đặt lại mật khẩu (giả lập)
    const handleResetPassword = async (values) => {
        setLoading(true);
        setTimeout(() => {
            if (values.newPassword !== values.confirmPassword) {
                message.error('Mật khẩu xác nhận không khớp!');
            } else {
                message.success('Đặt lại mật khẩu thành công!');
                window.location.href = '/login';
            }
            setLoading(false);
        }, 1000);
    };

    return (
        // BEM: auth-page
        <div className="auth-page">
            <header>
                <Header />
            </header>

            {/* BEM: auth-form__main */}
            <main className="auth-form__main">
                {/* BEM: auth-form__card */}
                <Card className="auth-form__card">
                    {/* BEM: auth-form__header */}
                    <div className="auth-form__header">
                        <h2 className="auth-form__title">Quên mật khẩu</h2>
                        {/* BEM: auth-form__subtitle */}
                        <p className="auth-form__subtitle">
                            {!isEmailSent
                                ? 'Nhập email của bạn để nhận link reset mật khẩu'
                                : 'Nhập mật khẩu mới để hoàn tất'}
                        </p>
                    </div>

                    <Divider className="auth-form__divider" />

                    {!isEmailSent ? (
                        <Form name="forgot_password" layout="vertical" onFinish={handleEmailSubmit}>
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    // BEM: auth-form__button auth-form__button--submit
                                    className="auth-form__button auth-form__button--submit"
                                    size="large"
                                    loading={loading}
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <Form name="reset_password" layout="vertical" onFinish={handleResetPassword}>
                            <Form.Item
                                name="newPassword"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    // BEM: auth-form__button auth-form__button--submit
                                    className="auth-form__button auth-form__button--submit"
                                    size="large"
                                    loading={loading}
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Card>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default ForgotPassword;