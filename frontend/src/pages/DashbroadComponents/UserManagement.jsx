import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Select } from 'antd';
import './UserManagement.css';
import { requestDeleteUser, requestGetAllUsers, requestUpdateUserAdmin } from '../../config/request';

const { Search } = Input;

const UserManagement = () => {
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên người dùng', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingUser(record);
                            form.setFieldsValue(record);
                            setIsEditModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => {
                            setDeletingUser(record);
                            setIsDeleteModalVisible(true);
                        }}
                        style={{ marginLeft: 8 }}
                    >
                        Xóa
                    </Button>
                </span>
            ),
        },
    ];

    const [data, setData] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        const res = await requestGetAllUsers();
        setData(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateUser = async () => {
        try {
            const data = {
                userId: editingUser.id,
                ...form.getFieldsValue(),
            };
            await requestUpdateUserAdmin(data);
            setIsEditModalVisible(false);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const data = {
                userId: deletingUser.id,
            };
            await requestDeleteUser(data);
            setIsDeleteModalVisible(false);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="user-management">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
            </div>
            <Search placeholder="Tìm kiếm người dùng" onSearch={() => {}} style={{ width: 300, marginBottom: 16 }} />
            <Table columns={columns} dataSource={data} rowKey="id" />

             {/* Edit User Modal */}
             <Modal
                title="Sửa thông tin người dùng"
                visible={isEditModalVisible}
                onOk={handleUpdateUser}
                onCancel={() => {
                    setIsEditModalVisible(false);
                }}
                okText="Lưu"
                cancelText="Hủy"
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
                        <Select
                            options={[
                                { value: 'user', label: 'Người dùng' },
                                { value: 'admin', label: 'Quản trị viên' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete User Modal */}
            <Modal
                title="Xóa người dùng"
                visible={isDeleteModalVisible}
                onOk={handleDeleteUser}
                onCancel={() => {
                    setIsDeleteModalVisible(false);
                }}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa người dùng "{deletingUser?.fullName}" không?</p>
            </Modal>
        </div>
    );
};

export default UserManagement;
