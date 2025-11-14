import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Select } from 'antd';
import './UserManagement.css';
import { requestDeleteUser, requestGetAllUsers, requestUpdateUserAdmin } from '../../config/request';

const { Search } = Input;

const UserManagement = () => {
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

    useEffect(() => { fetchData(); }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Tên người dùng', dataIndex: 'fullName' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Vai trò', dataIndex: 'role' },

        {
            title: 'Hành động',
            render: (_, record) => (
                <>
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
                        danger
                        type="primary"
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                            setDeletingUser(record);
                            setIsDeleteModalVisible(true);
                        }}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    const handleUpdateUser = async () => {
        await requestUpdateUserAdmin({
            userId: editingUser.id,
            ...form.getFieldsValue(),
        });
        setIsEditModalVisible(false);
        fetchData();
    };

    const handleDeleteUser = async () => {
        await requestDeleteUser({ userId: deletingUser.id });
        setIsDeleteModalVisible(false);
        fetchData();
    };

    return (
        <div className="user-management">
            <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>

            <Search placeholder="Tìm kiếm người dùng" style={{ width: 300, marginBottom: 16 }} />

            <Table columns={columns} dataSource={data} rowKey="id" />

            {/* Edit */}
            <Modal
                title="Sửa thông tin người dùng"
                open={isEditModalVisible}
                onOk={handleUpdateUser}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="fullName" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: 'user', label: 'Người dùng' },
                                { value: 'admin', label: 'Quản trị viên' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete */}
            <Modal
                title="Xóa người dùng"
                open={isDeleteModalVisible}
                onOk={handleDeleteUser}
                onCancel={() => setIsDeleteModalVisible(false)}
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc muốn xóa "{deletingUser?.fullName}"?</p>
            </Modal>
        </div>
    );
};

export default UserManagement;
