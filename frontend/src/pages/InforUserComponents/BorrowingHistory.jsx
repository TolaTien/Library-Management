import React, { useEffect, useState, useMemo } from 'react';
import { Card, Empty, List, Tag, Image, Typography, Space, Spin, Button } from 'antd';
// Đã thêm requestReturnBook
import { requestCancelBook, requestGetHistoryUser, requestReturnBook, requestGetFine} from '../../config/request'; 
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
            if (item.status === 'pending' || item.status === 'success') {
                return sum + (item.quantity || 0);
            }
            return sum;
        }, 0);
    }, [borrowedBooks]);

    // Số đầu sách đã mượn (Số lượng bản ghi lịch sử)
    const totalBorrowedItems = borrowedBooks.filter(item => 
        item.status === 'pending' || item.status === 'success'
    ).length;

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
    const handleReturnBook = async (idHistory, bookId) => {
    setIsReturning(true); // BẬT LOADING
    try {
        await requestReturnBook({ idHistory, bookId }); 
        setBorrowedBooks(prevBooks => prevBooks.filter(book => book.id !== idHistory));
        toast.success('Trả sách thành công!');

        // Giữ lại setTimeout để đồng bộ tổng số lượng sách
        setTimeout(() => {
            fetchData();
        }, 500); 
    } catch (error) {
        toast.error(error.response?.data?.message || 'Trả sách thất bại');
    } finally {
        setIsReturning(false); // TẮT LOADING
    }
};
    //HÀM TÍNH TIỀN PHẠT
const calculateFine = async (idHistory, bookId) => {
    try {
        const fineRes = await requestGetFine(idHistory);
        const { daysOverdue, totalFine } = fineRes.data;

        if (daysOverdue > 0) {
            Modal.confirm({
                title: 'Xác nhận Trả sách Quá Hạn',
                content: (
                    <Space direction="vertical">
                        <Text>Sách đã quá hạn <Text strong type="danger">{daysOverdue} ngày</Text>.</Text>
                        <Text>Tổng tiền phạt tạm tính: <Text strong type="warning">{totalFine.toLocaleString('vi-VN')} VNĐ</Text>.</Text>
                        <Text>Bạn có chắc chắn muốn tiến hành trả sách và chấp nhận tiền phạt?</Text>
                    </Space>
                ),
                okText: 'Trả Sách và Chấp Nhận Phạt',
                cancelText: 'Hủy',
                onOk: () => handleReturnBook(idHistory, bookId), 

                onCancel: () => setIsReturning(false)
            });
            
        } else {
            handleReturnBook(idHistory, bookId);
        }

    } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể tính toán tiền phạt.');
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
                        
                        // Tính toán số ngày còn lại/quá hạn
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
                                                        onClick={() => calculateFine(item.id, item.bookId)}
                                                        className="borrow-history__return-button"
                                                        disabled={isReturning}
                                                        loading={isReturning}
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