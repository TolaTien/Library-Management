import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Select, message } from 'antd';
import { requestDeleteUser, requestGetAllUsers, requestUpdateUserAdmin } from '../../config/request';
// Import file CSS riêng
import './UserManagement.css';

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
    const [data, setData] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await requestGetAllUsers();
            setData(res.metadata);
        } catch (error) {
            message.error('Không thể tải dữ liệu người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateUser = async () => {
        setLoading(true);
        try {
            const data = {
                userId: editingUser.id,
                ...form.getFieldsValue(),
            };
            await requestUpdateUserAdmin(data);
            message.success('Cập nhật người dùng thành công.');
            setIsEditModalVisible(false);
            fetchData();
        } catch (error) {
            message.error('Cập nhật thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setLoading(true);
        try {
            const data = {
                userId: deletingUser.id,
            };
            await requestDeleteUser(data);
            message.success('Xóa người dùng thành công.');
            setIsDeleteModalVisible(false);
            fetchData();
        } catch (error) {
            message.error('Xóa thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', render: (text) => <span className="user-admin-panel__id">{text.slice(0, 10)}</span> },
        { title: 'Tên người dùng', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                // BEM: user-admin-panel__action-buttons
                <span className="user-admin-panel__action-buttons">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            setEditingUser(record);
                            form.setFieldsValue(record);
                            setIsEditModalVisible(true);
                        }}
                        loading={loading}
                        className="user-admin-panel__button--edit"
                    >
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => {
                            setDeletingUser(record);
                            setIsDeleteModalVisible(true);
                        }}
                        loading={loading}
                        className="user-admin-panel__button--delete"
                    >
                        Xóa
                    </Button>
                </span>
            ),
        },
    ];

    return (
        // BEM: user-admin-panel
        <div className="user-admin-panel">
            {/* BEM: user-admin-panel__header */}
            <div className="user-admin-panel__header">
                <h2 className="user-admin-panel__title">Quản lý người dùng</h2>
            </div>
            
            {/* BEM: user-admin-panel__search */}
            <Search 
                placeholder="Tìm kiếm người dùng" 
                onSearch={() => {}} 
                className="user-admin-panel__search" 
            />
            
            {/* BEM: user-admin-panel__table-wrapper */}
            <div className="user-admin-panel__table-wrapper">
                <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
            </div>

            {/* Edit User Modal */}
            <Modal
                title="Sửa thông tin người dùng"
                open={isEditModalVisible}
                onOk={handleUpdateUser}
                onCancel={() => {
                    setIsEditModalVisible(false);
                }}
                okText="Lưu"
                cancelText="Hủy"
                confirmLoading={loading}
                className="user-admin-panel__modal-edit"
            >
                <Form form={form} layout="vertical" name="edit_user_form">
                    <Form.Item
                        name="fullName"
                        label="Tên người dùng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Option value="user">Người dùng</Option>
                            <Option value="admin">Quản trị viên</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete User Modal */}
            <Modal
                title="Xóa người dùng"
                open={isDeleteModalVisible}
                onOk={handleDeleteUser}
                onCancel={() => {
                    setIsDeleteModalVisible(false);
                }}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                confirmLoading={loading}
                className="user-admin-panel__modal-delete"
            >
                <p>Bạn có chắc chắn muốn xóa người dùng "<strong>{deletingUser?.fullName}</strong>" không?</p>
            </Modal>
        </div>
    );
};

export default UserManagement;