import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
    requestGetAllHistoryBook,
    requestUpdateStatusBook,
    requestSendReminder
} from "../../config/request";
import "./LoanRequestManagement.css";

const LoanRequestManagement = () => {
    const [data, setData] = useState([]);
    const [filterReminder, setFilterReminder] = useState(false);
    const [loading, setLoading] = useState(false);

    // trạng thái sắp xếp SL
    const [sortOrder, setSortOrder] = useState("none"); // none | asc | desc

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await requestGetAllHistoryBook();
            setData(res.data);
        } catch (err) {
            console.log("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id, status, productId, userId) => {
        try {
            await requestUpdateStatusBook({ idHistory: id, status, productId, userId });
            fetchData();
        } catch (err) {
            console.log("Update error:", err);
        }
    };

    const handleSendReminder = async (idHistory, userId) => {
        try {
            await requestSendReminder({ idHistory, userId });
        } catch (err) {
            console.log("Reminder error:", err);
        }
    };

    // Toggle sort SL
    const toggleSortQuantity = () => {
        setSortOrder(prev => {
            if (prev === "none") return "asc";
            if (prev === "asc") return "desc";
            return "none";
        });
    };

    // Lọc sách quá hạn
    const overdueList = data.filter(
        (item) =>
            dayjs(item.returnDate).isBefore(dayjs()) && item.status === "success"
    );

    const baseData = filterReminder ? overdueList : data;

    // Sắp xếp theo SL
    const sortedData = [...baseData].sort((a, b) => {
        if (sortOrder === "asc") return a.quantity - b.quantity;
        if (sortOrder === "desc") return b.quantity - a.quantity;
        return 0;
    });

    return (
        <div className="loan-container">
            <h2 className="title">Quản lý yêu cầu mượn sách</h2>

            <div className="top-buttons">
                <button
                    className={filterReminder ? "btn-primary" : "btn-outline"}
                    onClick={() => setFilterReminder(true)}
                >
                    Sách quá hạn cần nhắc
                </button>

                <button
                    className={!filterReminder ? "btn-primary" : "btn-outline"}
                    onClick={() => setFilterReminder(false)}
                >
                    Tất cả yêu cầu
                </button>
            </div>

            <div className="table-wrapper">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người mượn</th>
                            <th>Ảnh</th>
                            <th>Tên sách</th>

                            {/* Cột SL có thể sort */}
                            <th
                                style={{ cursor: "pointer" }}
                                onClick={toggleSortQuantity}
                            >
                                SL
                                {sortOrder === "asc" && " ▲"}
                                {sortOrder === "desc" && " ▼"}
                            </th>

                            <th>Ngày mượn</th>
                            <th>Ngày trả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="loading-text">Đang tải...</td>
                            </tr>
                        ) : (
                            sortedData.map((record) => {
                                const overdue = dayjs(record.returnDate).isBefore(dayjs());

                                return (
                                    <tr key={record.id}>
                                        <td className="id-col">{record.id.slice(0, 10)}</td>
                                        <td>{record.fullName}</td>

                                        <td>
                                            <img
                                                className="book-img"
                                                src={`${import.meta.env.VITE_API_URL_IMAGE}/${record.product.image}`}
                                            />
                                        </td>

                                        <td className="book-name">{record.product.nameProduct}</td>

                                        {/* SL sắp xếp */}
                                        <td>{record.quantity}</td>

                                        <td>{dayjs(record.borrowDate).format("DD/MM/YYYY")}</td>

                                        <td className={overdue ? "overdue" : ""}>
                                            {dayjs(record.returnDate).format("DD/MM/YYYY")}
                                        </td>

                                        <td>
                                            <span className={`status-badge ${record.status}`}>
                                                {record.status === "pending"
                                                    ? "Chờ duyệt"
                                                    : record.status === "success"
                                                    ? "Đã duyệt"
                                                    : record.status === "returned"
                                                    ? "Đã trả"
                                                    : "Từ chối"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="action-group">
                                                {record.status === "pending" && (
                                                    <>
                                                        <button
                                                            className="btn-small btn-approve"
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    record.id,
                                                                    "success",
                                                                    record.product.id,
                                                                    record.userId
                                                                )
                                                            }
                                                        >
                                                            Duyệt
                                                        </button>

                                                        <button
                                                            className="btn-small btn-danger"
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    record.id,
                                                                    "cancel",
                                                                    record.product.id,
                                                                    record.userId
                                                                )
                                                            }
                                                        >
                                                            Từ chối
                                                        </button>
                                                    </>
                                                )}

                                                {overdue && record.status === "success" && (
                                                    <button
                                                        className="btn-small btn-warning"
                                                        onClick={() =>
                                                            handleSendReminder(
                                                                record.id,
                                                                record.userId
                                                            )
                                                        }
                                                    >
                                                        Nhắc nhở
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoanRequestManagement;
