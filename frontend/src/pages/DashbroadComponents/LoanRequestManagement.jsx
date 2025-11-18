import React, { useEffect, useState } from 'react';
import { Table, Button, Tag } from 'antd';
import { requestGetAllHistoryBook, requestUpdateStatusBook } from '../../config/request';
import dayjs from 'dayjs';
import './LoanRequestManagement.css';


const LoanRequestManagement = () => {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        const res = await requestGetAllHistoryBook();
        setData(res.data);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleUpdateStatus = async (id, status, productId, userId) => {
        try {
            const data = {
                idHistory: id,
                status,
                productId,
                userId,
            };
            await requestUpdateStatusBook(data);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        { title: 'ID Yêu cầu', dataIndex: 'id', key: 'id', render: (text) => <span>{text.slice(0, 10)}</span> },
        { title: 'Người mượn', dataIndex: 'fullName', key: 'fullName' },
        {
            title: 'Ảnh',
            dataIndex: 'product',
            key: 'product',
            render: (record) => (
                <img
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
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
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                let color = status === 'pending' ? 'green' : status === 'success' ? 'geekblue' : 'volcano';
                return (
                    <Tag color={color}>
                        {status === 'pending' ? 'Chờ duyệt' : status === 'success' ? 'Đã duyệt' : 'Từ chối'}
                    </Tag>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <span>
                    {record.status === 'pending' && (
                        <Button
                            onClick={() => handleUpdateStatus(record.id, 'success', record.product.id, record.userId)}
                            type="primary"
                        >
                            Duyệt
                        </Button>
                    )}
                    {record.status === 'pending' && (
                        <Button
                            onClick={() => handleUpdateStatus(record.id, 'cancel', record.product.id, record.userId)}
                            type="primary"
                            danger
                        >
                            {' '}
                            Từ chối
                        </Button>
                    )}
                </span>
            ),
        },
    ];

    return (
        <div className="loan-request-container">
            <h2 className="text-2x1 mb-4 font-bold">Quản lý yêu cầu mượn sách</h2>
            <Table columns={columns} dataSource={data} rowKey="id" />
        </div>

    );
};

export default LoanRequestManagement;
