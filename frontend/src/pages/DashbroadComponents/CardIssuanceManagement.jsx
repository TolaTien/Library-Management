import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, message } from 'antd';
import './CardIssuanceManagement.css';
import { 
  requestGetRequestLoan, 
  requestConfirmIdStudent, 
  requestCancelIdStudent 
} from '../../config/request';

const CardIssuanceManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    visible: false,
    type: null, // "issue" | "cancel"
    user: null,
  });

  const [form] = Form.useForm();

  // -------------------- LOAD DATA --------------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await requestGetRequestLoan();
      setData(res.data || []); // đảm bảo luôn là mảng
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------- OPEN / CLOSE MODAL --------------------
  const openModal = (type, user) => {
    if (!user) return;
    setModal({ visible: true, type, user });
  };

  const closeModal = () => {
    setModal({ visible: false, type: null, user: null });
    form.resetFields();
  };

  // -------------------- HANDLE ISSUE (CẤP THẺ) --------------------
  const onIssueSubmit = async (values) => {
    if (!modal.user) return;
    setLoading(true);
    try {
      await requestConfirmIdStudent({
        userId: modal.user.id,
        idStudent: values.idStudent,
      });

      setData(prev =>
        prev.map(item =>
          item.id === modal.user.id
            ? { ...item, idStudent: values.idStudent }
            : item
        )
      );

      message.success(`Đã cấp thẻ cho ${modal.user.fullName}`);
      closeModal();
    } catch (err) {
      console.error(err);
      message.error("Cấp thẻ thất bại");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- HANDLE CANCEL --------------------
  const handleCancelRequest = async () => {
    if (!modal.user) return;
    setLoading(true);
    try {
      await requestCancelIdStudent(modal.user.id);

      setData(prev =>
        prev.map(item =>
          item.id === modal.user.id ? { ...item, idStudent: "0" } : item
        )
      );

      message.success(`Đã hủy yêu cầu cấp thẻ của ${modal.user.fullName}`);
      closeModal();
    } catch (err) {
      console.error(err);
      message.error("Hủy yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- TABLE COLUMNS --------------------
  const columns = [
    { title: "ID", dataIndex: "id", render: text => <span>{text.slice(0,10)}</span> },
    { title: "Họ và tên", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Số điện thoại", dataIndex: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "idStudent",
      render: v => (
        <Tag color={v === "0" ? "blue" : "green"}>
          {v === "0" ? "Chờ cấp" : "Đã cấp"}
        </Tag>
      )
    },
    {
      title: "Hành động",
      render: (_, record) =>
        record.idStudent === "0" ? (
          <div className="flex gap-2">
            <Button type="primary" onClick={() => openModal("issue", record)}>Cấp thẻ</Button>
            <Button danger type="primary" onClick={() => openModal("cancel", record)}>Hủy</Button>
          </div>
        ) : <span>-</span>
    }
  ];

  // -------------------- RENDER --------------------
  return (
    <div className="card-issuance-container">
      <div className="card-isuance-header">
        <h2>Quản lý cấp thẻ sinh viên</h2>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* MODAL CẤP THẺ */}
      <Modal
        open={modal.visible && modal.type === "issue"}
        title={`Cấp thẻ cho: ${modal.user?.fullName || ''}`}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={loading}
        okText="Cấp thẻ"
      >
        <Form form={form} layout="vertical" onFinish={onIssueSubmit}>
          <Form.Item
            name="idStudent"
            label="Mã số sinh viên"
            rules={[{ required: true, message: "Vui lòng nhập MSSV!" }]}
          >
            <Input placeholder="Nhập mã số sinh viên" />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL HỦY */}
      <Modal
        open={modal.visible && modal.type === "cancel"}
        title="Xác nhận hủy yêu cầu"
        onCancel={closeModal}
        onOk={handleCancelRequest}
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
        okText="Hủy yêu cầu"
        cancelText="Không"
      >
        <p>Bạn có chắc chắn muốn hủy yêu cầu cấp thẻ của <b>{modal.user?.fullName || ''}</b> không?</p>
      </Modal>
    </div>
  );
};

export default CardIssuanceManagement;
