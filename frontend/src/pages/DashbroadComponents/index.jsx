import React, { useState } from "react";
import UserManagement from "./UserManagement";
import LoanRequestManagement from "./LoanRequestManagement";
import CardIssuanceManagement from "./CardIssuanceManagement";
import BookManagement from "./BookManagement";
import Statistics from "./Statistics";
import "./Index.css";

const components = {
    stats: <Statistics />,
    user: <UserManagement />,
    loan: <LoanRequestManagement />,
    card: <CardIssuanceManagement />,
    book: <BookManagement />,
};

const IndexDashBroad = () => {
    const [selectedKey, setSelectedKey] = useState("stats");

    return (
        <div className="layout">

            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="logo">Library</div>

                <ul className="menu">
                    <li
                        className={selectedKey === "stats" ? "active" : ""}
                        onClick={() => setSelectedKey("stats")}
                    >
                        📊 Thống kê
                    </li>

                    <li
                        className={selectedKey === "book" ? "active" : ""}
                        onClick={() => setSelectedKey("book")}
                    >
                        📚 Quản lý sách
                    </li>

                    <li
                        className={selectedKey === "loan" ? "active" : ""}
                        onClick={() => setSelectedKey("loan")}
                    >
                        📄 Quản lý mượn sách
                    </li>

                    <li
                        className={selectedKey === "card" ? "active" : ""}
                        onClick={() => setSelectedKey("card")}
                    >
                        🆔 Quản lý cấp thẻ
                    </li>

                    <li
                        className={selectedKey === "user" ? "active" : ""}
                        onClick={() => setSelectedKey("user")}
                    >
                        👤 Quản lý người dùng
                    </li>
                </ul>
            </aside>

            {/* MAIN CONTENT */}
            <div className="main">
                <header className="header"></header>

                <main className="content">
                    <div className="content-inner">
                        {components[selectedKey] || <div>Chọn mục từ menu</div>}
                    </div>
                </main>

                <footer className="footer">
                    Thư viện đẳng cấp nhất thế giới
                </footer>
            </div>
        </div>
    );
};

export default IndexDashBroad;
