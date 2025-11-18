import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, message } from 'antd';
import './CardIssuanceManagement.css';
import { requestGetRequestLoan, requestConfirmIdStudent, cancelRequestIdStudent} from '../../config/request';


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
      setData(res.data);
    } catch {
      message.error('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Modal Cấp thẻ ---
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
      await requestConfirmIdStudent({ userId: selectedUser.id, idStudent: values.idStudent });
      message.success(`Đã cấp thẻ cho ${selectedUser.fullName}`);
      handleIssueCancel();
      fetchData();
    } catch {
      message.error('Cấp thẻ thất bại');
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Hủy ---
  const showCancelModal = (user) => {
    setSelectedUser(user);
    setIsCancelModalVisible(true);
  };

  const handleCancelCancel = () => {
    setIsCancelModalVisible(false);
    setSelectedUser(null);
  };

  const handleCancelOk = async () => {
    setLoading(true);
    try {
      await cancelRequestIdStudent({ userId: selectedUser.id });

      message.success(`Đã hủy yêu cầu cấp thẻ của ${selectedUser.fullName}`);
      handleCancelCancel();
      fetchData(); // Tải lại danh sách
    } catch (error) {
      message.error('Hủy yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (text) => <span>{text.slice(0, 10)}</span> },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Trạng thái',
      dataIndex: 'idStudent',
      key: 'idStudent',
      render: (idStudent) => (
        <Tag color={idStudent === '0' ? 'blue' : 'green'}>
          {idStudent === '0' ? 'Chờ cấp' : 'Đã cấp'}
        </Tag>
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
    <div className="card-issuance-container">
      <div className="card-isuance-header">
        <h2>Quản lý cấp thẻ sinh viên</h2>
      </div>

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

