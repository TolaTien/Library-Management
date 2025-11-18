import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Button, Spin, message, Form, Input, Upload } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { requestIdStudent, requestUpdateUser,  } from '../../config/request';
import { toast } from 'react-toastify';
import { useStore } from '../../hooks/useStore';
import "./PersonalInfor.css";

const PersonalInfo = () => {
    // FIX: Đặt loading thành false sau khi dataUser được load lần đầu,
    // hoặc quản lý loading qua store nếu cần, ở đây tôi giữ logic ban đầu nhưng setFieldsValue sẽ dừng loading.
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    const {dataUser, setDataUser} = useStore();

    useEffect(() => {
        if (dataUser) {
            form.setFieldsValue(dataUser);
            // Giả sử dataUser đã được fetch xong, ta dừng loading ban đầu
            setLoading(false);
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
            setIsEditing(false);
            setDataUser({ ...dataUser, ...values }); // Cập nhật dataUser trong store
            toast.success('Cập nhật thông tin thành công')
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };


    // Kiểm tra dataUser trước khi sử dụng để tránh lỗi
    const safeDataUser = dataUser || {};

    const viewItems = [
        { key: '1', label: 'Họ và tên', children: safeDataUser.fullName },
        { key: '2', label: 'Email', children: safeDataUser.email },
        { key: '3', label: 'Số điện thoại', children: safeDataUser.phone || 'Chưa cập nhật' },
        { key: '4', label: 'Địa chỉ', children: safeDataUser.address || 'Chưa cập nhật' },
        { key: '5', label: 'Mã sinh viên', children: safeDataUser.idStudent || 'Chưa có' },
    ];
    
    // Hiển thị Loading State
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
                    <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)} loading={loading}>
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
                        src={`${import.meta.env.VITE_API_URL}/${safeDataUser.avatar}`}
                        icon={<UserOutlined />}
                        className="personal-info-card__avatar"
                    />

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
                                <Button type="primary" htmlType="submit" className="personal-info-card__button--save" loading={loading}>
                                    Lưu thay đổi
                                </Button>
                                <Button onClick={() => setIsEditing(false)} disabled={loading}>Hủy</Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <>
                            <Descriptions bordered layout="vertical" items={viewItems} className="personal-info-card__descriptions" />
                            {!safeDataUser.idStudent  && ( // Hiển thị nếu MSSV chưa có
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