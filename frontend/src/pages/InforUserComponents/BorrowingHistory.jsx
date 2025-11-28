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

    const fetchData = async () => {
        try {
            const res = await requestGetHistoryUser();
            setBorrowedBooks(res.data);
        } catch (error) {

            toast.error(error.response?.data?.message || 'Lỗi tải lịch sử mượn sách');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="borrow-history__loading">
                <Spin size="large" />
            </div>
        );
    }

    const handleCancelBook = async (idHistory) => {
        try {
            await requestCancelBook({ idHistory });
            toast.success('Huỷ mượn sách thành công');
            // Tải lại dữ liệu sau khi hủy thành công
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Hủy mượn sách thất bại');
        }
    };

    return (
        <Card title="Lịch sử mượn sách" className="borrow-history">
            {borrowedBooks.length > 0 ? (
                <List
                    itemLayout="vertical"
                    dataSource={borrowedBooks}
                    className="borrow-history__list"
                    renderItem={(item) => {
                        const statusInfo = statusConfig[item.status] || { text: item.status, color: 'default' };
                        return (
                            <List.Item key={item.id} className="!p-0 mb-4">
                                <div className="borrow-history__item">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Image
                                            width={100}
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
                                            <Space direction="vertical" size="small" className="borrow-history__details-list">
                                                <Text type="secondary">Số lượng: {item.quantity}</Text>
                                                <Text type="secondary">Ngày mượn: {dayjs(item.borrowDate).format('DD/MM/YYYY')}</Text>
                                                <Text type="secondary">Ngày trả: {dayjs(item.returnDate).format('DD/MM/YYYY')}</Text>
                                                {item.status === 'success' && (
                                                    <p className="borrow-history__days-remaining">Số ngày còn lại : {dayjs(item.returnDate).diff(dayjs(), 'day')}{' '}ngày</p>
                                                )}
                                            </Space>
                                        </div>

                                        <div className="borrow-history__action-column">
                                            <Tag color={statusInfo.color} className="borrow-history__status-tag">{statusInfo.text}</Tag>
                                            <Text type="secondary" className="borrow-history__id-text">  Mã mượn: {item.id.substring(0, 8)}</Text>
                                            {item.status === 'pending' && (
                                                <Button danger type="primary" onClick={() => handleCancelBook(item.id)}>
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