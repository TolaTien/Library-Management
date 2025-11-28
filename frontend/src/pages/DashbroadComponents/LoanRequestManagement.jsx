import React, { useEffect, useState } from 'react';
import { Table, Button, Tag } from 'antd';
import { requestGetAllHistoryBook, requestUpdateStatusBook, requestSendReminder } from '../../config/request';
import dayjs from 'dayjs';
import './LoanRequestManagement.css';

const LoanRequestManagement = () => {
    const [data, setData] = useState([]);
    const [filterReminder, setFilterReminder] = useState(false);

    const fetchData = async () => {
        const res = await requestGetAllHistoryBook();
        setData(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id, status, productId, userId) => {
        try {
            const data = { idHistory: id, status, productId, userId };
            await requestUpdateStatusBook(data);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSendReminder = async (idHistory, userId) => {
        try {
            const res = await requestSendReminder({ idHistory, userId });
            console.log("Reminder sent:", res);
        } catch (err) {
            console.log("Reminder error:", err);
        }
    };

    // Lọc sách quá hạn
    const overdueList = data.filter((item) => {
        return dayjs(item.returnDate).isBefore(dayjs()) && item.status === 'success';
    });

    const tableData = filterReminder ? overdueList : data;

    const columns = [
        { title: 'ID Yêu cầu', dataIndex: 'id', key: 'id', render: (text) => <span>{text.slice(0, 10)}</span> },
        { title: 'Người mượn', dataIndex: 'fullName', key: 'fullName' },
        {
            title: 'Ảnh',
            dataIndex: 'product',
            key: 'product',
            render: (record) => (
                <img style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                     src={`${import.meta.env.VITE_API_URL_IMAGE}/${record.image}`}
                     alt=""
                />
            ),
        },
        { title: 'Tên sách', dataIndex: 'product', key: 'product', render: (record) => record.nameProduct },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Ngày mượn',
            dataIndex: 'borrowDate',
            key: 'borrowDate',
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày trả',
            dataIndex: 'returnDate',
            key: 'returnDate',
            render: (text) => {
                const isOverdue = dayjs(text).isBefore(dayjs());
                return <span style={{ color: isOverdue ? 'red' : 'black' }}>{dayjs(text).format('DD/MM/YYYY')}</span>;
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                let color = status === 'pending' ? 'green' : status === 'success' ? 'geekblue' : 'volcano';
                return (
                    <Tag color={color}>
                        {status === 'pending'
                            ? 'Chờ duyệt'
                            : status === 'success'
                                ? 'Đã duyệt'
                                : 'Từ chối'}
                    </Tag>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => {
                const isOverdue = dayjs(record.returnDate).isBefore(dayjs());

                return (
                    <span>
                        {record.status === 'pending' && (
                            <Button
                                onClick={() =>
                                    handleUpdateStatus(record.id, 'success', record.product.id, record.userId)
                                }
                                type="primary"
                            >
                                Duyệt
                            </Button>
                        )}

                        {record.status === 'pending' && (
                            <Button
                                onClick={() =>
                                    handleUpdateStatus(record.id, 'cancel', record.product.id, record.userId)
                                }
                                type="primary"
                                danger
                                style={{ marginLeft: 8 }}
                            >
                                Từ chối
                            </Button>
                        )}

                        {/* Nút nhắc nhở khi quá hạn */}
                        {isOverdue && record.status === "success" && (
                            <Button
                                onClick={() => handleSendReminder(record.id, record.userId)}
                                style={{
                                    marginLeft: 10,
                                    background: 'orange',
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                Nhắc nhở
                            </Button>
                        )}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="loan-request-container">
            <h2 className="text-2x1 mb-4 font-bold">Quản lý yêu cầu mượn sách</h2>

            {/* 2 nút chức năng */}
            <div style={{ marginBottom: 20 }}>
                <Button type="primary" onClick={() => setFilterReminder(true)} style={{ marginRight: 10 }}>
                    Xem sách cần nhắc nhở
                </Button>

                <Button onClick={() => setFilterReminder(false)}>
                    Xem tất cả yêu cầu
                </Button>
            </div>

            <Table columns={columns} dataSource={tableData} rowKey="id" />
        </div>
    );
};

export default LoanRequestManagement;
