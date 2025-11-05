import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Button, Spin, message, Form, Input, Upload } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { requestIdStudent, requestUpdateUser, requestUploadImage } from '../../config/request';
import { toast } from 'react-toastify';
import { useStore } from '../../hooks/useStore';

const PersonalInfo = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    const { dataUser } = useStore();

    useEffect(() => {
        if (dataUser) {
            form.setFieldsValue(dataUser);
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
        try {
            await requestUpdateUser(values);
            toast.success('Cập nhật thông tin thành công');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleBeforeUpload = async (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
        }
        if (isJpgOrPng && isLt2M) {
            // Đọc file và hiển thị preview
            const reader = new FileReader();
            const formData = new FormData();
            formData.append('image', file);

            try {
                await requestUploadImage(formData);
                window.location.reload();
            } catch (error) {
                console.log(error);
            }

            reader.readAsDataURL(file);
            reader.onload = () => {
                setIsEditing(false);
                message.success('Đổi ảnh thành công!');
            };
        }
        // Ngăn chặn việc tự động tải lên
        return false;
    };

    const viewItems = [
        { key: '1', label: 'Họ và tên', children: dataUser.fullName },
        { key: '2', label: 'Email', children: dataUser.email },
        { key: '3', label: 'Số điện thoại', children: dataUser.phone || 'Chưa cập nhật' },
        { key: '4', label: 'Địa chỉ', children: dataUser.address || 'Chưa cập nhật' },
        { key: '5', label: 'Mã sinh viên', children: dataUser.idStudent || 'Chưa có' },
    ];

    return (
        <Card
            title="Thông tin cá nhân"
            bordered={false}
            extra={
                !isEditing && (
                    <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                        Chỉnh sửa
                    </Button>
                )
            }
        >
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                    <Avatar
                        size={100}
                        src={`${import.meta.env.VITE_API_URL}/${dataUser.avatar}`}
                        icon={<UserOutlined />}
                    />
                    {isEditing && (
                        <Upload name="avatar" showUploadList={false} beforeUpload={handleBeforeUpload}>
                            <Button icon={<UploadOutlined />}>Đổi ảnh</Button>
                        </Upload>
                    )}
                </div>
                <div className="flex-1 w-full">
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
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="mr-2">
                                    Lưu thay đổi
                                </Button>
                                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <>
                            <Descriptions bordered layout="vertical" items={viewItems} />
                            {!dataUser.idStudent && (
                                <Button type="primary" onClick={handleRequestStudentId} className="mt-4">
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
