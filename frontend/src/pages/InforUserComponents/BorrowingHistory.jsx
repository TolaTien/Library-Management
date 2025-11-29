import React, { useEffect, useState } from 'react';
import { Card, Empty, List, Tag, Image, Typography, Space, Spin, Button } from 'antd';
// Đã thêm requestReturnBook
import { requestCancelBook, requestGetHistoryUser, requestReturnBook } from '../../config/request'; 
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
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

    const handleCancelBook = async (idHistory) => {
        try {
            await requestCancelBook({ idHistory });
            toast.success('Huỷ mượn sách thành công');
            // Tải lại danh sách sau khi hủy
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Hủy mượn sách thất bại');
        }
    }; 

    // hàm trả sách
    const handleReturnBook = async (idHistory) => {
        try {
            // Gọi API trả sách, truyền ID lịch sử mượn
            await requestReturnBook({ idHistory }); 
            toast.success('Trả sách thành công!');
            // Tải lại danh sách để cập nhật trạng thái
            fetchData(); 
        } catch (error) {
            // Hiển thị lỗi nếu API trả về (ví dụ: sách đã quá hạn)
            toast.error(error.response?.data?.message || 'Trả sách thất bại');
        }
    };


    if (loading) {
        return (
            <div className="borrow-history__loading">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Card title="Lịch sử mượn sách" className="borrow-history">
            {borrowedBooks.length > 0 ? (
                <List
                    itemLayout="vertical"
                    dataSource={borrowedBooks}
                    className="borrow-history__list"
                    renderItem={(item) => {
                        const statusInfo = statusConfig[item.status] || { text: item.status, color: 'default' };
                        
                        // ✅ Tính toán số ngày còn lại/quá hạn
                        const daysLeft = dayjs(item.returnDate).diff(dayjs(), 'day');
                        const isOverdue = daysLeft < 0 && item.status === 'success';

                        return (
                            <List.Item key={item.id} className="borrow-history__list-item">
                                <div className="borrow-history__item-wrapper">
                                    <div className="borrow-history__item-content">
                                        <Image
                                            width={100}
                                            className="borrow-history__image"
                                            src={`${import.meta.env.VITE_API_URL}/${item.product.image}`}
                                            alt={item.product.nameProduct}
                                            preview={false}
                                        />
                                        <div className="borrow-history__info-column">
                                            <Title level={5} className="borrow-history__book-title">
                                                {item.product.nameProduct}
                                            </Title>
                                            <Space direction="vertical" size="small" className="borrow-history__details-list">
                                                <Text type="secondary">Số lượng: {item.quantity}</Text>
                                                <Text type="secondary">Ngày mượn: {dayjs(item.borrowDate).format('DD/MM/YYYY')}</Text>
                                                <Text type="secondary">Ngày trả: {dayjs(item.returnDate).format('DD/MM/YYYY')}</Text>
                                                
                                                {/* HIỂN THỊ SỐ NGÀY CÒN LẠI / QUÁ HẠN */}
                                                {item.status === 'success' && (
                                                    <p className="borrow-history__days-info">
                                                        {isOverdue ? (
                                                            <Text strong type="danger">
                                                                ĐÃ QUÁ HẠN: {-daysLeft} ngày
                                                            </Text>
                                                        ) : (
                                                            <Text type="success">
                                                                Số ngày còn lại: {daysLeft} ngày
                                                            </Text>
                                                        )}
                                                    </p>
                                                )}

                                                {/* NÚT TRẢ SÁCH (CHỈ CHO TRẠNG THÁI SUCCESS) */}
                                                {item.status === 'success' && (
                                                    <Button 
                                                        type="primary" 
                                                        onClick={() => handleReturnBook(item.id)}
                                                        className="borrow-history__return-button"
                                                    >
                                                        Trả Sách
                                                    </Button>
                                                )}
                                                
                                            </Space>
                                        </div>
                                    </div>

                                    <div className="borrow-history__action-column">
                                        <Tag color={statusInfo.color} className="borrow-history__status-tag">{statusInfo.text}</Tag>
                                        <Text type="secondary" className="borrow-history__id-text">Mã mượn: {item.id.substring(0, 8)}</Text>
                                        
                                        {/* NÚT HỦY MƯỢN (CHỈ CHO TRẠNG THÁI PENDING) */}
                                        {item.status === 'pending' && (
                                            <Button danger type="primary" onClick={() => handleCancelBook(item.id)}>
                                                Huỷ mượn
                                            </Button>
                                        )}
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