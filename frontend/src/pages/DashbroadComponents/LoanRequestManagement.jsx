import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import dayjs from "dayjs";
import "./LoanRequestManagement.css";

import {
  requestGetAllHistoryBook,
  requestUpdateStatusBook,
} from "../../config/request";

const LoanRequestManagement = () => {
  /* -------------------- STATE -------------------- */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -------------------- FETCH DATA -------------------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await requestGetAllHistoryBook();
      setData(res.data);
    } catch {
      message.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* -------------------- UPDATE STATUS -------------------- */
  const handleUpdateStatus = async (record, newStatus) => {
    const payload = {
      idHistory: record.id,
      status: newStatus,
      productId: record.product.id,
      userId: record.userId,
    };

    try {
      await requestUpdateStatusBook(payload);
      message.success(
        newStatus === "success"
          ? "Đã duyệt yêu cầu!"
          : "Đã từ chối yêu cầu!"
      );
      fetchData();
    } catch {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  /* -------------------- TABLE COLUMNS -------------------- */
  const columns = [
    {
      title: "ID Yêu cầu",
      dataIndex: "id",
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: "Người mượn",
      dataIndex: "fullName",
    },
    {
      title: "Ảnh",
      dataIndex: "product",
      render: (p) => (
        <img
          className="loan-img"
          src={`${import.meta.env.VITE_API_URL_IMAGE}/${p.image}`}
          alt="book"
        />
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "product",
      render: (p) => p.nameProduct,
    },
    { title: "Số lượng", dataIndex: "quantity" },

    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày trả",
      dataIndex: "returnDate",
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },

    /* -------------------- TRẠNG THÁI -------------------- */
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const map = {
          pending: { color: "green", text: "Chờ duyệt" },
          success: { color: "geekblue", text: "Đã duyệt" },
          cancel: { color: "volcano", text: "Từ chối" },
        };

        return <Tag color={map[status].color}>{map[status].text}</Tag>;
      },
    },

    /* -------------------- ACTION BUTTONS -------------------- */
    {
      title: "Hành động",
      render: (_, record) =>
        record.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() => handleUpdateStatus(record, "success")}
            >
              Duyệt
            </Button>

            <Button
              danger
              type="primary"
              onClick={() => handleUpdateStatus(record, "cancel")}
            >
              Từ chối
            </Button>
          </div>
        ) : (
          <span>-</span>
        ),
    },
  ];

  return (
    <div className="loan-request-container">
      <h2 className="loan-title">Quản lý yêu cầu mượn sách</h2>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default LoanRequestManagement;
