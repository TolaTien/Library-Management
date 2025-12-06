import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { useEffect, useState, useRef } from 'react';
import useDebounce from '../hooks/useDebounce';
import { requestLogout, requestSearchProduct } from '../config/request';
import libraryIcon from '../assets/images/library-icon.png';
import './Header.css';

function Header() {
    const { dataUser } = useStore();
    const navigate = useNavigate();
    const [valueSearch, setValueSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const debounce = useDebounce(valueSearch, 500);

    // State cho Dropdown Menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref để bắt sự kiện click outside

    const handleLogout = async () => {
        try {
            await requestLogout();
            navigate('/');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    // Xử lý click ra ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Xử lý Search
    useEffect(() => {
        const fetchData = async () => {
            if (!debounce.trim()) {
                setSearchResults([]);
                setIsResultVisible(false);
                return;
            }
            try {
                const res = await requestSearchProduct(debounce);
                setSearchResults(res.data);
                setIsResultVisible(res.data.length > 0);
            } catch (error) {
                console.error('Failed to search for products:', error);
                setSearchResults([]);
                setIsResultVisible(false);
            }
        };
        fetchData();
    }, [debounce]);

    return (
        <header className="library-header">
            <div className="library-header__container">
                <div className="library-header__content">
                    {/* Logo */}
                    <Link to={'/'} className="library-header__logo-link">
                        <div className="library-header__logo">
                            <h1 className="library-header__title"> 
                                <img className="library-icon" src={libraryIcon} alt="library-icon" />
                                Thư Viện
                            </h1>
                        </div>
                    </Link>
                    
                    {/* Search Bar */}
                    <div className="library-header__search">
                        <div className="library-header__search-wrapper">
                            <div className="library-header__search-icon-wrapper">
                                <svg className="library-header__search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={valueSearch}
                                onChange={(e) => setValueSearch(e.target.value)}
                                onFocus={() => setIsResultVisible(true)}
                                onBlur={() => setTimeout(() => setIsResultVisible(false), 200)}
                                placeholder="Tìm kiếm sách, tác giả..."
                                className="library-header__search-input"
                            />
                        </div>
                        
                        {isResultVisible && searchResults.length > 0 && (
                            <div className="library-header__search-results">
                                <ul className="library-header__search-results-list">
                                    {searchResults.map((product) => (
                                        <li key={product.id} className="library-header__search-result-item">
                                            <Link to={`/product/${product.id}`} className="library-header__search-result-link">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${product.image}`}
                                                    alt={product.nameProduct}
                                                    className="library-header__search-result-image"
                                                />
                                                <div className="library-header__search-result-info">
                                                    <p className="library-header__search-result-name">{product.nameProduct}</p>
                                                    <p className="library-header__search-result-publisher">{product.publisher}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Auth Buttons / User Info */}
                    <div className="library-header__user-action">
                        {dataUser && dataUser.id ? (
                            // --- CUSTOM DROPDOWN ---
                            <div className="user-dropdown-container" ref={dropdownRef}>
                                {/* Nút kích hoạt Dropdown */}
                                <div className="user-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    {dataUser.avatar ? (
                                        <img 
                                            src={dataUser.avatar} 
                                            alt="avatar" 
                                            className="custom-avatar" 
                                        />
                                    ) : (
                                        <div className="custom-avatar-placeholder">
                                            {dataUser.fullName ? dataUser.fullName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    )}
                                    <div className="user-info-text">
                                        <span className="user-name">{dataUser.fullName || 'Người dùng'}</span>
                                        <span className="user-email">{dataUser.email}</span>
                                    </div>
                                </div>

                                {/* Menu Dropdown */}
                                {isMenuOpen && (
                                    <div className="custom-dropdown-menu">
                                        <div className="dropdown-item" onClick={() => {navigate('/infoUser', { state: { tab: 'info' } }); setIsMenuOpen(false);}}>
                                            <span className="dropdown-icon">👤</span> Thông tin cá nhân
                                        </div>
                                        <div className="dropdown-item" onClick={() => {navigate('/infoUser', { state: { tab: 'history' } }); setIsMenuOpen(false);}}>
                                            <span className="dropdown-icon">📖</span> Lịch sử mượn sách
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <div className="dropdown-item danger" onClick={handleLogout}>
                                            <span className="dropdown-icon">🚪</span> Đăng xuất
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // --- LOGIN / REGISTER BUTTONS ---
                            <div className="library-header__auth-buttons">
                                <Link to={'/login'}>
                                    <button className="btn-header btn-login">
                                        Đăng nhập
                                    </button>
                                </Link>
                                <Link to={'/register'}>
                                    <button className="btn-header btn-register">
                                        Đăng ký
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;