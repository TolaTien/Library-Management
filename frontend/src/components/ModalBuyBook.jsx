import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // 1. THÊM IMPORT NÀY
import dayjs from 'dayjs';
import { useStore } from '../hooks/useStore';
import { requestCreateHistoryBook } from '../config/request';
import { toast } from 'react-toastify';
import './ModalBuyBook.css';

const BORROW_DURATION_MAX_DAYS = 30;

function ModalBuyBook({ visible, onCancel, bookData }) {
    const { dataUser } = useStore();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        quantity: 1,
        returnDate: ''
    });

    const today = dayjs();
    const minReturnDate = today.add(1, 'day');
    const maxReturnDate = today.add(BORROW_DURATION_MAX_DAYS, 'day');

    useEffect(() => {
        if (visible) {
            setFormData({
                quantity: 1,
                returnDate: minReturnDate.format('YYYY-MM-DD')
            });
        }
    }, [visible, minReturnDate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
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

    // Nếu không hiển thị thì return null
    if (!visible) return null;

    const isSubmitDisabled = !bookData || bookData.stock <= 0 || loading;

    // 2. SỬ DỤNG PORTAL ĐỂ ĐẨY MODAL RA BODY
    return ReactDOM.createPortal(
        <div className="custom-modal-overlay">
            <div className="custom-modal-container">
                {/* Header */}
                <div className="modal-header">
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span>📖</span>
                        <span>Đăng ký mượn sách</span>
                    </div>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Phần thông tin sách */}
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
                                    <div>Nhà xuất bản: <b>{bookData.publisher}</b></div>
                                    <div>Số trang: <b>{bookData.pages} trang</b></div>
                                    <div>Năm XB: <b>{bookData.publishYear}</b></div>
                                    <div>
                                        Còn lại: <b style={{color: '#1890ff'}}>{bookData.stock} quyển</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phần Form nhập liệu */}
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
                                            max="5"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            required
                                        />
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
                                    {loading ? 'Đang xử lý...' : 'Xác nhận mượn'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>,
        document.body // Tham số thứ 2: Nơi modal sẽ được render (cuối thẻ body)
    );
}

export default ModalBuyBook;