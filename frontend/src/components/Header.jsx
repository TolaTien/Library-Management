import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HistoryOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { requestLogout, requestSearchProduct } from '../config/request';
import libraryIcon from '../assets/images/library-icon.png';
// Import file CSS riêng
import './Header.css'; 

function Header() {
    const { dataUser } = useStore();
    const navigate = useNavigate();
    const [valueSearch, setValueSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const debounce = useDebounce(valueSearch, 500);

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
        // Block: library-header
        <header className="library-header">
            <div className="library-header__container">
                <div className="library-header__content">
                    {/* Logo */}
                    <Link to={'/'} className="library-header__logo-link">
                        <div className="library-header__logo">
                            <h1 className="library-header__title"> <img className="library-icon" src={libraryIcon} alt="library-icon" />Thư Viện</h1>
                        </div>
                    </Link>
                    
                    {/* Search Bar */}
                    <div className="library-header__search">
                        <div className="library-header__search-wrapper">
                            <div className="library-header__search-icon-wrapper">
                                <svg
                                    className="library-header__search-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
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
                                            <Link to={`/product/${product.id}`}className="library-header__search-result-link">
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
                            // User Info Dropdown
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'profile',
                                            icon: <UserOutlined/>,
                                            label: 'Thông tin cá nhân',
                                            onClick: () => navigate('/infoUser'),
                                        },
                                        {
                                            key: 'settings',
                                            icon: <HistoryOutlined/>,
                                            label: 'Lịch sử mượn sách',
                                            onClick: () => navigate('/infoUser'),
                                        },
                                        {
                                            key: 'settings2',
                                            icon: <SendOutlined />,
                                            label: 'Gửi yêu cầu cấp mã sinh viên',
                                            onClick: () => navigate('/infoUser'),
                                        },
                                        {
                                            type: 'divider',
                                        },
                                        {
                                            key: 'logout',
                                            icon: <LogoutOutlined />,
                                            label: 'Đăng xuất',
                                            danger: true,
                                            onClick: () => handleLogout(),
                                        },
                                    ],
                                }}
                                placement="bottomRight"
                                arrow
                            >
                                <div className="library-header__user-avatar-wrapper">
                                    <Avatar
                                        size={32}
                                        icon={<UserOutlined />}
                                        src={dataUser.avatar}
                                        className="library-header__user-avatar"
                                    />
                                    <div className="library-header__user-info">
                                        <p className="library-header__user-name">
                                            {dataUser.fullName || 'Người dùng'}
                                        </p>
                                        <p className="library-header__user-email">{dataUser.email}</p>
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            // Login/Register Buttons
                            <div className="library-header__auth-buttons">
                                <Link to={'/login'}>
                                    {/* Sử dụng component Ant Design, giữ nguyên cách đặt tên */}
                                    <Button className="library-header__button library-header__button--login">
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link to={'/register'}>
                                    <button className="library-header__button library-header__button--register">
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