import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message } from 'antd';
import { requestGetAllHistoryBook, requestUpdateStatusBook } from '../../config/request';
import dayjs from 'dayjs';
// Import file CSS riêng
import './LoanRequestManagement.css';

const LoanRequestManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await requestGetAllHistoryBook();
            setData(res.metadata);
        } catch (error) {
            message.error('Không thể tải dữ liệu lịch sử mượn sách.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const handleUpdateStatus = async (id, status, productId, userId) => {
        setLoading(true);
        try {
            const data = {
                idHistory: id,
                status,
                productId,
                userId,
            };
            await requestUpdateStatusBook(data);
            message.success(`Đã ${status === 'success' ? 'duyệt' : 'từ chối'} yêu cầu.`);
            fetchData();
        } catch (error) {
            console.error(error);
            message.error('Cập nhật trạng thái thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { 
            title: 'ID Yêu cầu', 
            dataIndex: 'id', 
            key: 'id', 
            render: (text) => <span className="loan-request-panel__id">{text.slice(0, 10)}</span> 
        },
        { title: 'Người mượn', dataIndex: 'fullName', key: 'fullName' },
        {
            title: 'Ảnh',
            dataIndex: 'product',
            key: 'product',
            render: (record) => (
                <img
                    // BEM: loan-request-panel__table-image
                    className="loan-request-panel__table-image"
                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${record.image}`}
                    alt={record.nameProduct}
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
                let color = status === 'pending' ? 'blue' : status === 'success' ? 'green' : 'red';
                let text = status === 'pending' ? 'Chờ duyệt' : status === 'success' ? 'Đã duyệt' : 'Từ chối';
                
                if (status === 'cancel') {
                    color = 'volcano';
                    text = 'Từ chối';
                } else if (status === 'success') {
                    color = 'geekblue';
                    text = 'Đã duyệt';
                } else if (status === 'pending') {
                    color = 'green';
                    text = 'Chờ duyệt';
                }

                return (
                    <Tag color={color} className="loan-request-panel__status-tag">
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            // BEM: loan-request-panel__action-buttons
            render: (text, record) => (
                <span className="loan-request-panel__action-buttons">
                    {record.status === 'pending' && (
                        <Button
                            onClick={() => handleUpdateStatus(record.id, 'success', record.product.id, record.userId)}
                            type="primary"
                            loading={loading}
                        >
                            Duyệt
                        </Button>
                    )}
                    {record.status === 'pending' && (
                        <Button
                            onClick={() => handleUpdateStatus(record.id, 'cancel', record.product.id, record.userId)}
                            type="primary"
                            danger
                            loading={loading}
                        >
                            Từ chối
                        </Button>
                    )}
                </span>
            ),
        },
    ];

    return (
        // BEM: loan-request-panel
        <div className="loan-request-panel">
            {/* BEM: loan-request-panel__header */}
            <div className="loan-request-panel__header">
                <h2 className="loan-request-panel__title">Quản lý yêu cầu mượn sách</h2>
            </div>
            
            {/* BEM: loan-request-panel__table-wrapper */}
            <div className="loan-request-panel__table-wrapper">
                <Table 
                    columns={columns} 
                    dataSource={data} 
                    rowKey="id" 
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default LoanRequestManagement;