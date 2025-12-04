import React, { useEffect, useState, useMemo } from 'react';
import { Card, Empty, List, Tag, Image, Typography, Space, Spin, Button, Popconfirm } from 'antd'; // ✅ Thêm Popconfirm
import { requestCancelBook, requestGetHistoryUser, requestReturnBook, requestGetFine } from '../../config/request'; 
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import './BorrowingHistory.css';

const { Text, Title } = Typography;

const statusConfig = {
    pending: { text: 'Đang chờ duyệt', color: 'gold' },
    success: { text: 'Thành công', color: 'green' },
    cancel: { text: 'Đã hủy', color: 'red' },
};

const BorrowingHistory = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReturning, setIsReturning] = useState(false);

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

    const totalQuantity = useMemo(() => {
        return borrowedBooks.reduce((sum, item) => {
            if (item.status === 'success' || item.status == "pending") {
                return sum + (item.quantity || 0);
            }
            return sum;
        }, 0);
    }, [borrowedBooks]);

    const totalBorrowedItems = borrowedBooks.filter(item => 
        item.status === 'success' || item.status === "pending"
    ).length;

    const handleCancelBook = async (idHistory) => {
        try {
            await requestCancelBook({ idHistory });
            toast.success('Huỷ mượn sách thành công');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Hủy mượn sách thất bại');
        }
    };

    const handleReturnBook = async (idHistory, bookId) => {
        // Nếu hàm này được gọi trực tiếp (không qua calculateFine), tự bật loading
        if (!isReturning) setIsReturning(true);
        
        try {
            await requestReturnBook({ idHistory, bookId }); 
            setBorrowedBooks(prevBooks => prevBooks.filter(book => book.id !== idHistory));
            toast.success('Trả sách thành công!');

            setTimeout(() => {
                fetchData();
            }, 500); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Trả sách thất bại');
        } finally {
            setIsReturning(false);
        }
    };

    const calculateFine = async (idHistory, bookId) => {
        setIsReturning(true); 
        try {
            await requestGetFine(idHistory);
            await handleReturnBook(idHistory, bookId);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể tính toán tiền phạt.');
            setIsReturning(false);
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
            <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '20px' }}>
                <Title level={4} style={{ margin: 0 }}>
                    Số đầu sách đang mượn: <Text strong>{totalBorrowedItems} loại</Text>
                </Title>
                <Title level={4} style={{ margin: 0 }}>
                    Tổng số lượng sách đang mượn: <Text strong>{totalQuantity} quyển</Text>
                </Title>
            </Space>
            
            {borrowedBooks.length > 0 ? (
                <List
                    itemLayout="vertical"
                    dataSource={borrowedBooks}
                    className="borrow-history__list"
                    renderItem={(item) => {
                        const statusInfo = statusConfig[item.status] || { text: item.status, color: 'default' };
                        
                        // Logic tính toán hiển thị (đã mở comment để Popconfirm dùng)
                        const daysLeft = dayjs(item.returnDate).diff(dayjs(), 'day');
                        const isOverdue = daysLeft < 0 && item.status === 'success';
                        // Tính tiền phạt dự kiến để hiển thị trong Popconfirm
                        const estimatedFine = isOverdue ? Math.abs(daysLeft) * 5000 : 0;

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
                                                
                                                {/* HIỂN THỊ TRẠNG THÁI QUÁ HẠN */}
                                                {item.status === 'success' && (
                                                    <div className="borrow-history__days-info">
                                                        {isOverdue ? (
                                                            <Space direction="vertical" size={0}>
                                                                <Text strong type="danger">
                                                                    ĐÃ QUÁ HẠN: {-daysLeft} ngày
                                                                </Text>
                                                                <Text type="warning" style={{ fontSize: '13px' }}>
                                                                    (Phạt dự kiến: {estimatedFine.toLocaleString('vi-VN')} VNĐ)
                                                                </Text>
                                                            </Space>
                                                        ) : (
                                                            <Text type="success">
                                                                Số ngày còn lại: {daysLeft} ngày
                                                            </Text>
                                                        )}
                                                    </div>
                                                )}

                                                {/* LOGIC NÚT TRẢ SÁCH VỚI POPCONFIRM */}
                                                {item.status === 'success' && (
                                                    isOverdue ? (
                                                        // TRƯỜNG HỢP 1: QUÁ HẠN -> Dùng Popconfirm
                                                        <Popconfirm
                                                            title="Xác nhận trả sách quá hạn"
                                                            description={
                                                                <div>
                                                                    <p>Sách đã quá hạn <Text type="danger" strong>{-daysLeft} ngày</Text>.</p>
                                                                    <p>Số tiền phạt cần đóng: <Text type="danger" strong>{estimatedFine.toLocaleString()} VNĐ</Text></p>
                                                                    <p>Bạn có chắc chắn muốn trả sách?</p>
                                                                </div>
                                                            }
                                                            onConfirm={() => calculateFine(item.id, item.bookId)}
                                                            okText="Đồng ý & Trả"
                                                            cancelText="Hủy"
                                                            okButtonProps={{ danger: true, loading: isReturning }}
                                                        >
                                                            <Button 
                                                                type="primary" 
                                                                danger 
                                                                className="borrow-history__return-button"
                                                                disabled={isReturning}
                                                            >
                                                                Trả Sách & Nộp Phạt
                                                            </Button>
                                                        </Popconfirm>
                                                    ) : (
                                                        // TRƯỜNG HỢP 2: BÌNH THƯỜNG -> Nút bấm trực tiếp
                                                        <Button 
                                                            type="primary" 
                                                            onClick={() => handleReturnBook(item.id, item.bookId)}
                                                            className="borrow-history__return-button"
                                                            disabled={isReturning}
                                                            loading={isReturning}
                                                        >
                                                            Trả Sách
                                                        </Button>
                                                    )
                                                )}
                                                
                                            </Space>
                                        </div>
                                    </div>

                                    <div className="borrow-history__action-column">
                                        <Tag color={statusInfo.color} className="borrow-history__status-tag">{statusInfo.text}</Tag>
                                        <Text type="secondary" className="borrow-history__id-text">Mã mượn: {item.id.substring(0, 8)}</Text>
                                        
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