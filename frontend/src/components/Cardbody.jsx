import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUser, faCalendar, faLanguage, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ModalBuyBook from '../components/ModalBuyBook';
import { useState } from 'react';
import './Cardbody.css'; 

function CardBody({ data }) {
    const [visible, setVisible] = useState(false);
    const [bookData, setBookData] = useState({});

    const showModal = async (data) => {
        setBookData(data);
        setVisible(true);
    };

    const onCancel = () => {
        setVisible(false);
    };

    // Block: book-card
    return (
        <div className="book-card">
            {/* Decorative gradient overlay */}
            <div className="book-card__overlay"></div>
            
            {/* 1. KHỐI HÌNH ẢNH (Bao gồm Stock và Bìa) */}
            <Link to={`/product/${data.id}`} className="book-card__link">
                <div className="book-card__image-container">
                    {/* Hình ảnh chính */}
                    <img
                        src={`${import.meta.env.VITE_API_URL_IMAGE}/${data.image}`}
                        className="book-card__image"
                        alt={data.nameProduct}
                    />
                    
                    {/* Stock badge */}
                    <div className="book-card__badge-position book-card__badge-position--top-right">
                        <span
                            className={`book-card__badge book-card__badge--stock ${
                                data.stock > 0
                                    ? 'book-card__badge--in-stock'
                                    : 'book-card__badge--out-of-stock'
                            }`}
                        >
                            {data.stock > 0 ? `✨ Còn ${data.stock} quyển` : '❌ Hết hàng'}
                        </span>
                    </div>
                    
                    {/* Cover type badge */}
                    <div className="book-card__badge-position book-card__badge-position--top-left">
                        <span
                            className={`book-card__badge book-card__badge--cover ${
                                data.covertType === 'hard'
                                    ? 'book-card__badge--hard-cover'
                                    : 'book-card__badge--soft-cover'
                            }`}
                        >
                            {data.covertType === 'hard' ? '📘 Bìa cứng' : '📙 Bìa mềm'}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Nội dung chi tiết */}
            <div className="book-card__body">
                
                {/* 2. TITLE (Tên sách) */}
                <Link to={`/product/${data.id}`} className="book-card__title-link">
                    <h6 className="book-card__title">
                        {data.nameProduct}
                    </h6>
                </Link>

                {/* 3. THÔNG TIN CHI TIẾT (Metadata) */}
                <div className="book-card__details">
                    
                    {/* Nhà xuất bản (Publisher) */}
                    <div className="book-card__info-item book-card__info-item--publisher">
                        <FontAwesomeIcon icon={faUser} className="book-card__info-icon" />
                        <span className="book-card__info-text">{data.publisher}</span>
                    </div>

                    {/* Công ty phát hành (Publishing Company) */}
                    {data.publishingCompany && (
                        <div className="book-card__info-item book-card__info-item--company">
                            <FontAwesomeIcon icon={faBuilding} className="book-card__info-icon" />
                            <span className="book-card__info-text">{data.publishingCompany}</span>
                        </div>
                    )}

                    {/* Số trang và năm xuất bản */}
                    <div className="book-card__metrics">
                        <div className="book-card__metric-item book-card__metric-item--pages">
                            <FontAwesomeIcon icon={faBookOpen} className="book-card__metric-icon" />
                            <span className="book-card__metric-text">{data.pages} trang</span>
                        </div>
                        <div className="book-card__metric-item book-card__metric-item--year">
                            <FontAwesomeIcon icon={faCalendar} className="book-card__metric-icon" />
                            <span className="book-card__metric-text">{data.publishYear}</span>
                        </div>
                    </div>

                    {/* Ngôn ngữ (Language) */}
                    {data.language && (
                        <div className="book-card__info-item book-card__info-item--language">
                            <FontAwesomeIcon icon={faLanguage} className="book-card__info-icon" />
                            <span className="book-card__info-text">{data.language}</span>
                        </div>
                    )}
                </div>

                {/* 4. Nút hành động */}
                <div className="book-card__action">
                    <button
                        onClick={() => showModal(data)}
                        disabled={data.stock <= 0}
                        className={`book-card__button ${
                            data.stock > 0
                                ? 'book-card__button--borrow'
                                : 'book-card__button--disabled'
                        }`}
                    >
                        {data.stock > 0 ? '📚 Mượn ngay' : '❌ Hết hàng'}
                    </button>
                </div>
            </div>
            
            <ModalBuyBook visible={visible} onCancel={onCancel} bookData={bookData} />
        </div>
    );
}

export default CardBody;