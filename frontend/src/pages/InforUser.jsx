import React, { useState, useEffect } from 'react'; // Nhớ thêm useEffect
import { useLocation } from 'react-router-dom'; 
import Sidebar from "./InforUserComponents/Sidebar.jsx";
import PersonalInfo from "./InforUserComponents/PersonalInfor.jsx";
import BorrowingHistory from "./InforUserComponents/BorrowingHistory.jsx";
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminNotifications from './InforUserComponents/AdminNotifications.jsx';
import './InforUser.css';

function InforUser() {
    const [activeComponent, setActiveComponent] = useState('info'); 
    const location = useLocation(); // Hook để lấy dữ liệu gửi từ navigate

    // Thêm đoạn này để bắt sự kiện từ Header
    useEffect(() => {
        if (location.state && location.state.tab) {
            setActiveComponent(location.state.tab);
        }
    }, [location]);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'info':
                return <PersonalInfo />;
            case 'history':
                return <BorrowingHistory />;
            case 'noti':
                return <AdminNotifications />;
            default:
                return <PersonalInfo />;
        }
    };

    return (
        <div className="user-profile-layout">
            <header>
                <Header />
            </header>
            
            <div className="user-profile__container">
                <aside className="user-profile__sidebar">
                    <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
                </aside>
                
                <main className="user-profile__content">
                    <div className="user-profile__active-view">
                        {renderComponent()}
                    </div>
                </main>
            </div>
            
            <footer>
                <Footer />
            </footer>
        </div>
    );
}
export default InforUser;
