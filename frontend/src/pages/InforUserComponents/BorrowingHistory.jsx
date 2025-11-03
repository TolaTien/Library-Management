import React, { useEffect, useState } from 'react';
import { Card, Empty, List, Tag, Image, Typography, Space, Spin, Button } from 'antd';
import { requestCancelBook, requestGetHistoryUser } from '../../config/request';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
// Import file CSS riêng
import './BorrowingHistory.css'; 

const { Text, Title } = Typography;

// Mapping for status colors and texts for better readability and maintenance
const statusConfig = {
    pending: { text: 'Đang chờ duyệt', color: 'gold' },
    success: { text: 'Thành công', color: 'green' },
    cancel: { text: 'Đã hủy', color: 'red' },
};

const BorrowingHistory = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await requestGetHistoryUser();
                setBorrowedBooks(res.metadata);
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCancelBook = async (idHistory) => {
        try {
            await requestCancelBook({ idHistory });
            toast.success('Huỷ mượn sách thành công');
            // Tải lại danh sách sau khi hủy
            setLoading(true);
            const res = await requestGetHistoryUser();
            setBorrowedBooks(res.metadata);
            setLoading(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    if (loading) {
        // BEM: borrow-history__loading
        return (
            <div className="borrow-history__loading">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Card title="Lịch sử mượn sách" bordered={false} className="borrow-history">
            {borrowedBooks.length > 0 ? (
                <List
                    itemLayout="vertical"
                    dataSource={borrowedBooks}
                    // BEM: borrow-history__list
                    className="borrow-history__list"
                    renderItem={(item) => {
                        const statusInfo = statusConfig[item.status] || { text: item.status, color: 'default' };
                        return (
                            // BEM: borrow-history__item-list
                            <List.Item key={item.id} className="borrow-history__item-list">
                                {/* BEM: borrow-history__item */}
                                <div className="borrow-history__item">
                                    {/* BEM: borrow-history__item-content */}
                                    <div className="borrow-history__item-content">
                                        {/* Image */}
                                        <Image
                                            width={100}
                                            // BEM: borrow-history__image
                                            className="borrow-history__image"
                                            src={`${import.meta.env.VITE_API_URL}/${item.product.image}`}
                                            alt={item.product.nameProduct}
                                            preview={false}
                                        />
                                        {/* Info Column */}
                                        <div className="borrow-history__info-column">
                                            <Title level={5} className="borrow-history__book-title">
                                                {item.product.nameProduct}
                                            </Title>
                                            {/* BEM: borrow-history__details */}
                                            <Space direction="vertical" size="small" className="borrow-history__details">
                                                <Text type="secondary">Số lượng: {item.quantity}</Text>
                                                <Text type="secondary">
                                                    Ngày mượn: {dayjs(item.borrowDate).format('DD/MM/YYYY')}
                                                </Text>
                                                <Text type="secondary">
                                                    Ngày trả: {dayjs(item.returnDate).format('DD/MM/YYYY')}
                                                </Text>
                                                {item.status === 'success' && (
                                                    <p className="borrow-history__days-remaining">
                                                        Số ngày còn lại : {dayjs(item.returnDate).diff(dayjs(), 'day')}{' '}
                                                        ngày
                                                    </p>
                                                )}
                                            </Space>
                                        </div>
                                        {/* Actions/Status Column */}
                                        {/* BEM: borrow-history__action-column */}
                                        <div className="borrow-history__action-column">
                                            <Tag color={statusInfo.color} className="borrow-history__status-tag">
                                                {statusInfo.text}
                                            </Tag>
                                            <Text type="secondary" className="borrow-history__id-text">
                                                Mã mượn: {item.id.substring(0, 8)}
                                            </Text>
                                            {item.status === 'pending' && (
                                                <Button 
                                                    danger 
                                                    type="primary" 
                                                    onClick={() => handleCancelBook(item.id)}
                                                    className="borrow-history__button--cancel"
                                                >
                                                    Huỷ mượn
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        );
                    }}
                />
            ) : (
                <Empty description="Bạn chưa mượn cuốn sách nào." />
            )}
        </Card>
    );
};

export default BorrowingHistory;