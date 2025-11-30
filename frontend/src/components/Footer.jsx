// Import file CSS riêng
import './Footer.css'; 
import libraryImage from "../assets/images/library-icon.png"

function Footer() {
    return (
        // Block: library-footer
        <footer className="library-footer">
            <div className="library-footer__container">
                <div className="library-footer__sections">
                    {/* Thông tin thư viện */}
                    <div className="library-footer__section library-footer__section--about">
                        <h3 className="library-footer__heading library-footer__heading--logo">
                            <img className="footer-library-image" src={libraryImage} alt="library-icon" /> Thư Viện
                        </h3>
                        <p className="library-footer__text library-footer__text--about">
                            Hệ thống quản lý thư viện hiện đại, cung cấp dịch vụ mượn sách trực tuyến 
                            và quản lý tài liệu hiệu quả.
                        </p>
                    </div>

                    {/* Liên kết nhanh */}
                    <div className="library-footer__section library-footer__section--links">
                        <h3 className="library-footer__heading">Liên kết nhanh</h3>
                        <ul className="library-footer__list">
                            <li>
                                <a href="#" className="library-footer__link">
                                    Trang chủ
                                </a>
                            </li>

                            <li>
                                <a href="#" className="library-footer__link">
                                    Quy định mượn sách
                                </a>
                            </li>
                            <li>
                                <a href="#" className="library-footer__link">
                                    Liên hệ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="library-footer__section library-footer__section--contact">
                        <h3 className="library-footer__heading">Liên hệ</h3>
                        <div className="library-footer__contact-info">
                            <p className="library-footer__text">📍 Trần Phú, Hà Đông Hà Nội</p>
                            <p className="library-footer__text">📞 (09) 1234 5678</p>
                            <p className="library-footer__text">✉️ thuvienquocgia@gmail.com</p>
                            <p className="library-footer__text">🕒 Thứ 2 - Chủ nhật: 8:00 - 20:00</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="library-footer__copyright">
                    <p className="library-footer__copyright-text">
                        © 2025 Hệ thống Quản lý Thư viện. Tất cả quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;