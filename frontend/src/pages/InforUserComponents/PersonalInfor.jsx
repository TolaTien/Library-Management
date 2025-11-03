import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Button, Spin, message, Form, Input, Upload } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { requestIdStudent, requestUpdateUser, requestUploadImage } from '../../config/request';
import { toast } from 'react-toastify';
import { useStore } from '../../hooks/useStore';
// Import file CSS riêng
import "./PersonalInfor.css"

const PersonalInfo = () => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    const { dataUser } = useStore();

    useEffect(() => {
        if (dataUser) {
            form.setFieldsValue(dataUser);
            setLoading(false); // Đã có dataUser, dừng loading ban đầu
        }
    }, [dataUser, form]);

    const handleRequestStudentId = async () => {
        try {
            const res = await requestIdStudent();
            toast.success(res.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleUpdateProfile = async (values) => {
        setLoading(true);
        try {
            await requestUpdateUser(values);
            toast.success('Cập nhật thông tin thành công');
            setIsEditing(false);
            window.location.reload(); // Tải lại để cập nhật store/UI
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBeforeUpload = async (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
            return false;
        }

        if (isJpgOrPng && isLt2M) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                setLoading(true);
                await requestUploadImage(formData);
                message.success('Đổi ảnh thành công!');
                window.location.reload(); 
            } catch (error) {
                console.error(error);
                message.error('Tải ảnh thất bại.');
            } finally {
                setLoading(false);
            }
        }
        return false; // Ngăn chặn việc tự động tải lên
    };

    const viewItems = [
        { key: '1', label: 'Họ và tên', children: dataUser?.fullName },
        { key: '2', label: 'Email', children: dataUser?.email },
        { key: '3', label: 'Số điện thoại', children: dataUser?.phone || 'Chưa cập nhật' },
        { key: '4', label: 'Địa chỉ', children: dataUser?.address || 'Chưa cập nhật' },
        { key: '5', label: 'Mã sinh viên', children: dataUser?.idStudent || 'Chưa có' },
    ];

    if (loading || !dataUser) {
        return (
            <div className="personal-info-card__loading">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Card
            title="Thông tin cá nhân"
            bordered={false}
            className="personal-info-card"
            extra={
                !isEditing && (
                    <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                        Chỉnh sửa
                    </Button>
                )
            }
        >
            {/* BEM: personal-info-card__content */}
            <div className="personal-info-card__content">
                {/* BEM: personal-info-card__avatar-section */}
                <div className="personal-info-card__avatar-section">
                    <Avatar
                        size={100}
                        src={`${import.meta.env.VITE_API_URL}/${dataUser.avatar}`}
                        icon={<UserOutlined />}
                        className="personal-info-card__avatar"
                    />
                    {isEditing && (
                        <Upload 
                            name="avatar" 
                            showUploadList={false} 
                            beforeUpload={handleBeforeUpload}
                            className="personal-info-card__avatar-upload"
                        >
                            <Button icon={<UploadOutlined />}>Đổi ảnh</Button>
                        </Upload>
                    )}
                </div>
                
                {/* BEM: personal-info-card__details-section */}
                <div className="personal-info-card__details-section">
                    {isEditing ? (
                        <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="phone" label="Số điện thoại">
                                <Input />
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ">
                                <Input />
                            </Form.Item>
                            {/* BEM: personal-info-card__form-actions */}
                            <Form.Item className="personal-info-card__form-actions">
                                <Button type="primary" htmlType="submit" className="personal-info-card__button--save">
                                    Lưu thay đổi
                                </Button>
                                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <>
                            <Descriptions bordered layout="vertical" items={viewItems} className="personal-info-card__descriptions" />
                            {dataUser && dataUser.idStudent === 'Chưa có' && ( // Kiểm tra chính xác
                                <Button type="primary" onClick={handleRequestStudentId} className="personal-info-card__button--request">
                                    Gửi yêu cầu cấp mã sinh viên
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default PersonalInfo;