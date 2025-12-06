import React, { useEffect, useState, useMemo } from 'react';
import CustomCard from '../../cardbody/CustomCard';
import { requestCancelBook, requestGetHistoryUser, requestReturnBook, requestGetFine } from '../../config/request'; 
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import './BorrowingHistory.css';

const statusConfig = {
    pending: { text: 'Đang chờ duyệt', color: 'gold', class: 'tag-gold' },
    success: { text: 'Thành công', color: 'green', class: 'tag-green' },
    cancel: { text: 'Đã hủy', color: 'red', class: 'tag-red' },
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
        if (!window.confirm("Bạn có chắc chắn muốn hủy yêu cầu mượn sách này?")) return;
        
        try {
            await requestCancelBook({ idHistory });
            toast.success('Huỷ mượn sách thành công');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Hủy mượn sách thất bại');
        }
    };

    const handleReturnBook = async (idHistory, bookId) => {
        if (!isReturning) setIsReturning(true);
        try {
            await requestReturnBook({ idHistory, bookId }); 
            setBorrowedBooks(prevBooks => prevBooks.filter(book => book.id !== idHistory));
            toast.success('Trả sách thành công!');
            setTimeout(() => { fetchData(); }, 500); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Trả sách thất bại');
        } finally {
            setIsReturning(false);
        }
    };

    const calculateFineAndReturn = async (idHistory, bookId) => {
        setIsReturning(true); 
        try {
            await requestGetFine(idHistory);
            await handleReturnBook(idHistory, bookId);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể tính toán tiền phạt.');
            setIsReturning(false);
        }
    };

    // Hàm xử lý xác nhận thay thế Popconfirm
    const handleConfirmReturn = (item, daysLeft, estimatedFine) => {
        const isOverdue = daysLeft < 0;
        let message = "Bạn có chắc chắn muốn trả cuốn sách này?";
        
        if (isOverdue) {
            message = `SÁCH ĐÃ QUÁ HẠN ${Math.abs(daysLeft)} ngày.\n\n` +
                    `Tiền phạt dự kiến: ${estimatedFine.toLocaleString()} VNĐ.\n\n` +
                    `Bạn có đồng ý trả sách và nộp phạt không?`;
            
            if (window.confirm(message)) {
                calculateFineAndReturn(item.id, item.bookId);
            }
        } else {
            if (window.confirm(message)) {
                handleReturnBook(item.id, item.bookId);
            }
        }
    };

    if (loading) {
        return (
            <div className="custom-spinner-container">
                <div className="custom-spinner"></div>
            </div>
        );
    }

    return (
        // Sử dụng CardBody đã viết trước đó
        <CustomCard title="Lịch sử mượn sách" className="borrow-history">
            
            {/* Thay thế Space và Typography bằng div và h4/span */}
            <div className="bh-header-info">
                <h4 className="bh-title">
                    Số đầu sách đang mượn: <span className="bh-text-strong">{totalBorrowedItems} loại</span>
                </h4>
                <h4 className="bh-title">
                    Tổng số lượng sách đang mượn: <span className="bh-text-strong">{totalQuantity} quyển</span>
                </h4>
            </div>
            
            {borrowedBooks.length > 0 ? (
                <div className="bh-list">
                    {borrowedBooks.map((item) => {
                        const statusInfo = statusConfig[item.status] || { text: item.status, class: 'tag-default' };
                        const daysLeft = dayjs(item.returnDate).diff(dayjs(), 'day');
                        const isOverdue = daysLeft < 0 && item.status === 'success';
                        const estimatedFine = isOverdue ? Math.abs(daysLeft) * 5000 : 0;

                        return (
                            <div key={item.id} className="bh-list-item">
                                <div className="bh-item-wrapper">
                                    <div className="bh-item-left">
                                        {/* Thay Image của Antd bằng img thường */}
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/${item.product.image}`}
                                            alt={item.product.nameProduct}
                                            className="bh-book-image"
                                        />
                                        
                                        <div className="bh-book-info">
                                            <h5 className="bh-book-name">{item.product.nameProduct}</h5>
                                            
                                            <div className="bh-details">
                                                <p style={{margin: '4px 0'}} className="bh-text-secondary">Số lượng: {item.quantity}</p>
                                                <p style={{margin: '4px 0'}} className="bh-text-secondary">Ngày mượn: {dayjs(item.borrowDate).format('DD/MM/YYYY')}</p>
                                                <p style={{margin: '4px 0'}} className="bh-text-secondary">Ngày trả: {dayjs(item.returnDate).format('DD/MM/YYYY')}</p>
                                                
                                                {/* Hiển thị quá hạn */}
                                                {item.status === 'success' && (
                                                    <div style={{marginTop: '8px'}}>
                                                        {isOverdue ? (
                                                            <div>
                                                                <span className="bh-text-danger bh-text-strong">
                                                                    ĐÃ QUÁ HẠN: {-daysLeft} ngày
                                                                </span>
                                                                <br/>
                                                                <span className="bh-text-warning" style={{ fontSize: '13px' }}>
                                                                    (Phạt dự kiến: {estimatedFine.toLocaleString('vi-VN')} VNĐ)
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="bh-text-success">
                                                                Số ngày còn lại: {daysLeft} ngày
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Nút trả sách */}
                                                {item.status === 'success' && (
                                                    <div style={{marginTop: '10px'}}>
                                                        <button 
                                                            className={`bh-btn ${isReturning ? 'btn-disabled' : 'btn-primary'}`}
                                                            disabled={isReturning}
                                                            onClick={() => handleConfirmReturn(item, daysLeft, estimatedFine)}
                                                        >
                                                            {isReturning ? 'Đang xử lý...' : (isOverdue ? 'Trả Sách & Nộp Phạt' : 'Trả Sách')}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột trạng thái và hành động hủy */}
                                    <div className="bh-action-col">
                                        <span className={`bh-tag ${statusInfo.class}`}>
                                            {statusInfo.text}
                                        </span>
                                        <span className="bh-text-secondary">
                                            Mã: {item.id.substring(0, 8)}
                                        </span>
                                        
                                        {item.status === 'pending' && (
                                            <button 
                                                className="bh-btn btn-danger"
                                                onClick={() => handleCancelBook(item.id)}
                                            >
                                                Huỷ mượn
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Thay thế Empty
                <div className="bh-empty">
                    <p>Bạn chưa mượn cuốn sách nào.</p>
                </div>
            )}
        </CustomCard>
    );
};

export default BorrowingHistory;