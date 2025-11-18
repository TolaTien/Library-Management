import { useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Link, useParams } from 'react-router-dom';
import { requestGetOneProduct } from '../config/request';
import { useState } from 'react';

import ModalBorrowBook from '../components/ModalBuyBook';
import { useStore } from '../hooks/useStore';
// Import file CSS riêng
import './DetailProduct.css'; 

function DetailProduct() {
    const { id } = useParams();
    const [dataProduct, setDataProduct] = useState({});
    const [visible, setVisible] = useState(false);

    const { dataUser } = useStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetOneProduct(id);
            setDataProduct(res.data);
        };
        fetchData();
    }, [id]);

    const showModal = async () => {
        setVisible(true);
    };

    if (!dataUser) return <div className="loading-state">loading....</div>;

    return (
        // BEM: product-detail-page
        <div className="product-detail-page">
            <Header />

            {/* Breadcrumb */}
            <div className="product-detail__breadcrumb-wrapper">
                {/* BEM: product-detail__breadcrumb */}
                <nav className="product-detail__breadcrumb">
                    <Link to={'/'} className="product-detail__breadcrumb-link">Trang chủ</Link>
                    <span className="product-detail__breadcrumb-separator">/</span>
                    <Link to={'/product'} className="product-detail__breadcrumb-link">Sách</Link>
                    <span className="product-detail__breadcrumb-separator">/</span>
                    <span className="product-detail__breadcrumb-current">Chi tiết sách</span>
                </nav>
            </div>

            {/* Main Content */}
            <main className="product-detail__main">
                {/* BEM: product-detail__content */}
                <div className="product-detail__content">
                    {/* BEM: product-detail__grid */}
                    <div className="product-detail__grid">
                        {/* Book Image */}
                        <div className="product-detail__image-wrapper">
                            <div className="product-detail__image-container">
                                <img
                                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${dataProduct.image}`}
                                    alt={dataProduct.nameProduct}
                                    className="product-detail__image"
                                />
                            </div>
                        </div>

                        {/* Book Details */}
                        <div className="product-detail__info-column">
                            {/* Title and Author */}
                            <div className="product-detail__header">
                                <h1 className="product-detail__title">{dataProduct.nameProduct}</h1>
                            </div>

                            {/* Book Information */}
                            <div className="product-detail__data">
                                <h3 className="product-detail__data-heading">Thông tin chi tiết</h3>
                                <div className="product-detail__data-list">
                                    <div className="product-detail__data-item">
                                        <span className="product-detail__data-label">Nhà xuất bản:</span>
                                        <span className="product-detail__data-value">{dataProduct.publisher}</span>
                                    </div>
                                    <div className="product-detail__data-item">
                                        <span className="product-detail__data-label">Công ty phát hành:</span>
                                        <span className="product-detail__data-value">
                                            {dataProduct.publishingCompany}
                                        </span>
                                    </div>
                                    <div className="product-detail__data-item">
                                        <span className="product-detail__data-label">Loại bìa:</span>
                                        <span className="product-detail__data-value">
                                            {dataProduct.coverType === 'hard' ? 'Bìa cứng' : 'Bìa mềm'}
                                        </span>
                                    </div>
                                    <div className="product-detail__data-item">
                                        <span className="product-detail__data-label">Số trang:</span>
                                        <span className="product-detail__data-value">{dataProduct.pages} trang</span>
                                    </div>
                                    <div className="product-detail__data-item">
                                        <span className="product-detail__data-label">Ngôn ngữ:</span>
                                        <span className="product-detail__data-value">{dataProduct.language}</span>
                                    </div>
                                    <div className="product-detail__data-item">
                                        <span className="product-detail__data-label">Năm xuất bản:</span>
                                        <span className="product-detail__data-value">{dataProduct.publishYear}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="product-detail__stock-status">
                                <span className="product-detail__stock-label">Số lượng : </span>
                                <span className="product-detail__stock-count">
                                    {dataProduct.stock} quyển
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="product-detail__actions">
                                <button
                                    onClick={showModal}
                                    className="product-detail__button"
                                >
                                    Mượn ngay
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="product-detail__description-section">
                        <h2 className="product-detail__description-heading">Mô tả sách</h2>
                        <div className="product-detail__description-content">
                            <p className="product-detail__description-text">{dataProduct.description}</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
            <ModalBorrowBook visible={visible} onCancel={() => setVisible(false)} bookData={dataProduct} />
        </div>
    );
}

export default DetailProduct;