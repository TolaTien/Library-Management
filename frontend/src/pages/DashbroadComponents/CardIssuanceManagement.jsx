import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, message } from 'antd';
import { requestGetRequestLoan, requestConfirmIdStudent } from '../../config/request';

const CardIssuanceManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isIssueModalVisible, setIsIssueModalVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await requestGetRequestLoan();
            setData(res.metadata);
        } catch (error) {
            message.error('Không thể tải danh sách yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Xử lý Modal Cấp thẻ ---
    const showIssueModal = (user) => {
        setSelectedUser(user);
        setIsIssueModalVisible(true);
    };

    const handleIssueCancel = () => {
        setIsIssueModalVisible(false);
        form.resetFields();
        setSelectedUser(null);
    };

    const handleIssueOk = () => {
        form.submit();
    };

    const onIssueFormFinish = async (values) => {
        setLoading(true);
        try {
            const data = {
                userId: selectedUser.id,
                idStudent: values.idStudent,
            };
            await requestConfirmIdStudent(data);
            message.success(`Đã cấp thẻ cho ${selectedUser.fullName}`);
            handleIssueCancel();
            fetchData();
        } catch (error) {
            message.error('Cấp thẻ thất bại');
        } finally {
            setLoading(false);
        }
    };

    // --- Xử lý Modal Hủy ---
    const showCancelModal = (user) => {
        setSelectedUser(user);
        setIsCancelModalVisible(true);
    };

    const handleCancelCancel = () => {
        setIsCancelModalVisible(false);
        setSelectedUser(null);
    };

    const handleCancelOk = async () => {
        // TODO: Gọi API để hủy yêu cầu cấp thẻ
        // Ví dụ: await requestCancelIssuance(selectedUser.id);
        message.info(`Đã hủy yêu cầu cấp thẻ cho ${selectedUser.fullName}`);
        handleCancelCancel();
        fetchData();
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', render: (text) => <span>{text.slice(0, 10)}</span> },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text) => (
                <img
                    style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${text}`}
                    alt="avatar"
                />
            ),
        },
        { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Trạng thái',
            dataIndex: 'idStudent',
            key: 'idStudent',
            render: (idStudent) => (
                <Tag color={idStudent === '0' ? 'blue' : 'green'}>{idStudent === '0' ? 'Chờ cấp' : 'Đã cấp'}</Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div className="flex gap-2">
                    {record.idStudent === '0' ? (
                        <>
                            <Button type="primary" onClick={() => showIssueModal(record)}>
                                Cấp thẻ
                            </Button>
                            <Button type="primary" danger onClick={() => showCancelModal(record)}>
                                Hủy
                            </Button>
                        </>
                    ) : (
                        <span>-</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-2xl mb-4 font-bold">Quản lý cấp thẻ sinh viên</h2>
            <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

            {/* Modal Cấp thẻ */}
            <Modal
                title={`Cấp thẻ cho: ${selectedUser?.fullName}`}
                open={isIssueModalVisible}
                onOk={handleIssueOk}
                onCancel={handleIssueCancel}
                confirmLoading={loading}
                okText="Cấp thẻ"
                cancelText="Hủy"
            >
                <Form form={form} onFinish={onIssueFormFinish} layout="vertical">
                    <Form.Item
                        name="idStudent"
                        label="Mã số sinh viên"
                        rules={[{ required: true, message: 'Vui lòng nhập mã số sinh viên!' }]}
                    >
                        <Input placeholder="Nhập mã số sinh viên" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Hủy yêu cầu */}
            <Modal
                title="Xác nhận hủy yêu cầu"
                open={isCancelModalVisible}
                onOk={handleCancelOk}
                onCancel={handleCancelCancel}
                confirmLoading={loading}
                okText="Xác nhận hủy"
                cancelText="Không"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Bạn có chắc chắn muốn hủy yêu cầu cấp thẻ của <b>{selectedUser?.fullName}</b> không?
                </p>
            </Modal>
        </div>
    );
};

export default CardIssuanceManagement;
