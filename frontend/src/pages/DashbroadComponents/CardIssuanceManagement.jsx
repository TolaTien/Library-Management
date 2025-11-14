import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, message } from 'antd';
import './CardIssuanceManagement.css';
import { requestGetRequestLoan, requestConfirmIdStudent } from '../../config/request';

const CardIssuanceManagement = () => {
  /* -------------------- STATE -------------------- */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dùng chung 1 modal cho cả "Cấp thẻ" và "Hủy"
  const [modal, setModal] = useState({
    visible: false,
    type: null,        // "issue" | "cancel"
    user: null,
  });

  const [form] = Form.useForm();

  /* -------------------- LOAD DATA -------------------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await requestGetRequestLoan();
      setData(res.data);
    } catch {
      message.error("Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* -------------------- OPEN MODAL -------------------- */
  const openModal = (type, user) => {
    setModal({
      visible: true,
      type,
      user,
    });
  };

  /* -------------------- CLOSE MODAL -------------------- */
  const closeModal = () => {
    setModal({ visible: false, type: null, user: null });
    form.resetFields();
  };

  /* -------------------- HANDLE ISSUE FORM (CẤP THẺ) -------------------- */
  const onIssueSubmit = async (values) => {
    setLoading(true);
    try {
      await requestConfirmIdStudent({
        userId: modal.user.id,
        idStudent: values.idStudent,
      });

      message.success(`Đã cấp thẻ cho ${modal.user.fullName}`);
      closeModal();
      fetchData();
    } catch {
      message.error("Cấp thẻ thất bại");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- HANDLE CANCEL REQUEST -------------------- */
  const handleCancelRequest = async () => {
    message.info(`Đã hủy yêu cầu cấp thẻ của ${modal.user.fullName}`);
    closeModal();
    fetchData();
  };

  /* -------------------- TABLE COLUMNS -------------------- */
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      render: (src) => (
        <div className="avatar-wrapper">
          <img
            className="avatar-img"
            src={`${import.meta.env.VITE_API_URL_IMAGE}/${src}`}
            alt="avatar"
          />
        </div>
      ),
    },
    { title: "Họ và tên", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Số điện thoại", dataIndex: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "idStudent",
      render: (v) => (
        <Tag color={v === "0" ? "blue" : "green"}>
          {v === "0" ? "Chờ cấp" : "Đã cấp"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) =>
        record.idStudent === "0" ? (
          <div className="flex gap-2">
            <Button type="primary" onClick={() => openModal("issue", record)}>
              Cấp thẻ
            </Button>
            <Button danger type="primary" onClick={() => openModal("cancel", record)}>
              Hủy
            </Button>
          </div>
        ) : (
          <span>-</span>
        ),
    },
  ];

  /* -------------------- RENDER -------------------- */
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
      />

      {/* -------------------- MODAL CẤP THẺ -------------------- */}
      <Modal
        open={modal.visible && modal.type === "issue"}
        title={`Cấp thẻ cho: ${modal.user?.fullName}`}
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

      {/* -------------------- MODAL HỦY -------------------- */}
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
        <p>
          Bạn có chắc chắn muốn hủy yêu cầu cấp thẻ của{" "}
          <b>{modal.user?.fullName}</b> không?
        </p>
      </Modal>
    </div>
  );
};

export default CardIssuanceManagement;
