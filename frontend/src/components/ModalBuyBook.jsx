import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import { useStore } from '../hooks/useStore';
// 1. IMPORT THÊM requestGetHistoryUser
import { requestCreateHistoryBook, requestGetHistoryUser } from '../config/request';
import { toast } from 'react-toastify';
import './ModalBuyBook.css';

const BORROW_DURATION_MAX_DAYS = 30;
const GLOBAL_MAX_QUANTITY = 5; // Hạn mức tối đa toàn cục

function ModalBuyBook({ visible, onCancel, bookData }) {
    const { dataUser } = useStore();
    const [loading, setLoading] = useState(false);
    
    // State lưu tổng số sách user đang giữ
    const [currentBorrowedTotal, setCurrentBorrowedTotal] = useState(0);
    const [checkingLimit, setCheckingLimit] = useState(false);

    const [formData, setFormData] = useState({
        quantity: 1,
        returnDate: ''
    });

    const { today, minReturnDate, maxReturnDate } = useMemo(() => {
        const now = dayjs();
        return {
            today: now,
            minReturnDate: now.add(1, 'day'),
            maxReturnDate: now.add(BORROW_DURATION_MAX_DAYS, 'day')
        };
    }, []);

    // Effect: Khi mở modal -> Reset Form & Gọi API check hạn mức
    useEffect(() => {
        if (visible) {
            // Reset form cơ bản
            setFormData({
                quantity: 1,
                returnDate: minReturnDate.format('YYYY-MM-DD')
            });

            // 2. GỌI API ĐỂ ĐẾM SỐ SÁCH ĐANG MƯỢN
            const fetchUserHistory = async () => {
                setCheckingLimit(true);
                try {
                    const res = await requestGetHistoryUser();
                    if (res && res.data) {
                        // Tính tổng số lượng sách đang ở trạng thái 'pending' hoặc 'success'
                        const total = res.data.reduce((sum, item) => {
                            if (item.status === 'success' || item.status === 'pending') {
                                return sum + (item.quantity || 0);
                            }
                            return sum;
                        }, 0);
                        setCurrentBorrowedTotal(total);
                    }
                } catch (error) {
                    console.error("Lỗi kiểm tra hạn mức:", error);
                } finally {
                    setCheckingLimit(false);
                }
            };
            fetchUserHistory();
        }
    }, [visible, minReturnDate]);

    // Tính số lượng còn được phép mượn
    const remainingQuota = Math.max(0, GLOBAL_MAX_QUANTITY - currentBorrowedTotal);

    // Xử lý khi nhập số lượng (Logic chặn mới)
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'quantity') {
            let val = parseInt(value);
            
            if (isNaN(val)) {
                setFormData(prev => ({ ...prev, [name]: '' }));
                return;
            }

            // Logic chặn: Không được vượt quá hạn mức còn lại
            if (val > remainingQuota) {
                if (remainingQuota === 0) {
                    toast.error(`Bạn đang giữ ${currentBorrowedTotal}/${GLOBAL_MAX_QUANTITY} quyển. Không thể mượn thêm!`);
                    val = 0; // Hoặc 1 tùy UX, nhưng ở đây disable nút submit rồi
                } else {
                    toast.warning(`Bạn đang giữ ${currentBorrowedTotal} quyển. Chỉ được mượn thêm tối đa ${remainingQuota} quyển!`);
                    val = remainingQuota;
                }
            }
            
            // Logic cũ: Không < 1 (Trừ khi hết hạn mức thì chấp nhận hiển thị số khác hoặc disable)
            if (val < 1 && remainingQuota > 0) val = 1;

            setFormData(prev => ({ ...prev, [name]: val }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        // Check hạn mức toàn cục
        if (currentBorrowedTotal >= GLOBAL_MAX_QUANTITY) {
            toast.error(`Bạn đã đạt giới hạn mượn ${GLOBAL_MAX_QUANTITY} quyển. Vui lòng trả sách trước khi mượn tiếp!`);
            return false;
        }

        if ((formData.quantity + currentBorrowedTotal) > GLOBAL_MAX_QUANTITY) {
            toast.error(`Tổng số sách mượn không được quá 5. Bạn chỉ còn lượt cho ${remainingQuota} quyển.`);
            return false;
        }

        if (!formData.quantity || formData.quantity < 1) {
            toast.error('Số lượng mượn không hợp lệ!');
            return false;
        }

        if (!formData.returnDate) {
            toast.error('Vui lòng chọn ngày trả!');
            return false;
        }

        const selectedDate = dayjs(formData.returnDate);
        if (selectedDate.isBefore(minReturnDate, 'day')) {
            toast.error('Ngày trả phải sau ngày mượn ít nhất 1 ngày!');
            return false;
        }
        if (selectedDate.isAfter(maxReturnDate, 'day')) {
            toast.error(`Thời gian mượn tối đa ${BORROW_DURATION_MAX_DAYS} ngày!`);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const borrowData = {
                quantity: parseInt(formData.quantity),
                fullName: dataUser?.fullName || '',
                address: dataUser?.address || '',
                phoneNumber: dataUser?.phoneNumber || '',
                studentId: dataUser?.idStudent || '',
                bookId: bookData?.id,
                borrowDate: today.format('YYYY-MM-DD'),
                returnDate: formData.returnDate,
            };

            await requestCreateHistoryBook(borrowData);
            toast.success('Đăng ký mượn sách thành công!');
            onCancel();
        } catch (error) {
            console.error('Error submitting borrow request:', error);
            toast.error(error.response?.data?.message || 'Đăng ký mượn sách thất bại!');
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    // Disable nút submit nếu hết hạn mức hoặc đang check
    const isOutOfQuota = remainingQuota <= 0;
    const isSubmitDisabled = !bookData || bookData.stock <= 0 || loading || isOutOfQuota || checkingLimit;

    return ReactDOM.createPortal(
        <div className="custom-modal-overlay">
            <div className="custom-modal-container">
                <div className="modal-header">
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span>📖</span>
                        <span>Đăng ký mượn sách</span>
                    </div>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>

                <div className="modal-body">
                    {bookData && (
                        <div className="book-info-card">
                            <h4 className="section-title">Thông tin sách</h4>
                            <div className="book-details-wrapper">
                                <img 
                                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${bookData.image}`} 
                                    alt={bookData.nameProduct} 
                                    className="book-cover-img"
                                />
                                <div className="book-text-info">
                                    <div className="book-name">{bookData.nameProduct}</div>
                                    <div>Còn lại: <b style={{color: '#1890ff'}}>{bookData.stock} quyển</b></div>
                                    
                                    {/* Hiển thị thông báo hạn mức ngay trong UI */}
                                    <div style={{marginTop: '10px', padding: '8px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: '4px', fontSize: '13px'}}>
                                        {checkingLimit ? (
                                            <span>⏳ Đang kiểm tra hạn mức...</span>
                                        ) : (
                                            <span>
                                                Bạn đang mượn: <b>{currentBorrowedTotal}/5</b> quyển. 
                                                <br/>
                                                Có thể mượn thêm: <b style={{color: remainingQuota > 0 ? 'green' : 'red'}}>{remainingQuota}</b> quyển.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="borrower-info-card">
                        <h4 className="section-title">👤 Thông tin mượn</h4>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label className="form-label required-mark">Số lượng</label>
                                        <input 
                                            type="number"
                                            name="quantity"
                                            className="custom-input"
                                            min="1"
                                            max={remainingQuota > 0 ? remainingQuota : 1} // Limit max input
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            disabled={isOutOfQuota || checkingLimit} // Chặn nhập nếu hết quota
                                            required
                                        />
                                        {isOutOfQuota && (
                                            <small style={{color: 'red', display: 'block', marginTop: '4px'}}>
                                                * Bạn đã hết hạn mức mượn sách.
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />

                            <h5 className="section-title" style={{fontSize: '14px'}}>📅 Thời gian mượn</h5>

                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label className="form-label">Ngày mượn</label>
                                        <input 
                                            type="text"
                                            className="custom-input"
                                            value={today.format('DD/MM/YYYY')}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="form-col">
                                    <div className="form-group">
                                        <label className="form-label required-mark">Ngày trả dự kiến</label>
                                        <input 
                                            type="date"
                                            name="returnDate"
                                            className="custom-input"
                                            value={formData.returnDate}
                                            onChange={handleInputChange}
                                            min={minReturnDate.format('YYYY-MM-DD')}
                                            max={maxReturnDate.format('YYYY-MM-DD')}
                                            required
                                            disabled={isOutOfQuota}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-modal btn-cancel" onClick={onCancel}>
                                    Hủy bỏ
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-modal btn-submit"
                                    disabled={isSubmitDisabled}
                                >
                                    {loading ? 'Đang xử lý...' : (isOutOfQuota ? 'Hết hạn mức' : 'Xác nhận mượn')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ModalBuyBook;