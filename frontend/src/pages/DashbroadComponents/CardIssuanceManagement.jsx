import React, { useEffect, useState } from "react";
import "./CardIssuanceManagement.css";
import {
    requestGetRequestLoan,
    requestConfirmIdStudent,
    cancelRequestIdStudent
} from "../../config/request";

const CardIssuanceManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isIssueModalVisible, setIsIssueModalVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [idStudent, setIdStudent] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await requestGetRequestLoan();
            setData(res.data);
        } catch {
            alert("Không thể tải danh sách yêu cầu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =====================
    // Modal cấp thẻ
    // =====================
    const showIssueModal = (user) => {
        setSelectedUser(user);
        setIdStudent("");
        setIsIssueModalVisible(true);
    };

    const handleIssueCancel = () => {
        setIsIssueModalVisible(false);
        setSelectedUser(null);
    };

    const handleIssueSubmit = async () => {
        if (!idStudent.trim()) {
            alert("Vui lòng nhập mã số sinh viên!");
            return;
        }

        setLoading(true);
        try {
            await requestConfirmIdStudent({
                userId: selectedUser.id,
                idStudent
            });

            alert(`Đã cấp thẻ cho ${selectedUser.fullName}`);
            handleIssueCancel();
            fetchData();
        } catch {
            alert("Cấp thẻ thất bại!");
        } finally {
            setLoading(false);
        }
    };

    // =====================
    // Modal Hủy yêu cầu
    // =====================
    const showCancelModal = (user) => {
        setSelectedUser(user);
        setIsCancelModalVisible(true);
    };

    const handleCancelSubmit = async () => {
        setLoading(true);
        try {
            await cancelRequestIdStudent({ userId: selectedUser.id });
            alert(`Đã hủy yêu cầu của ${selectedUser.fullName}`);
            setIsCancelModalVisible(false);
            fetchData();
        } catch {
            alert("Hủy yêu cầu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-issuance-container">
            <div className="header">
                <h2>Quản lý cấp thẻ sinh viên</h2>
            </div>

            {/* Table */}
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="loading-row">
                                Đang tải...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="empty-row">
                                Không có yêu cầu nào
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id.slice(0, 10)}</td>
                                <td>{item.fullName}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>
                                    <span
                                        className={
                                            item.idStudent === "0"
                                                ? "tag tag-blue"
                                                : "tag tag-green"
                                        }
                                    >
                                        {item.idStudent === "0"
                                            ? "Chờ cấp"
                                            : "Đã cấp"}
                                    </span>
                                </td>

                                <td>
                                    {item.idStudent === "0" ? (
                                        <>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => showIssueModal(item)}
                                            >
                                                Cấp thẻ
                                            </button>

                                            <button
                                                className="btn btn-danger"
                                                onClick={() => showCancelModal(item)}
                                            >
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* ================= */}
            {/* MODAL CẤP THẺ    */}
            {/* ================= */}
            {isIssueModalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Cấp thẻ cho: {selectedUser?.fullName}</h3>

                        <label>Mã số sinh viên</label>
                        <input
                            value={idStudent}
                            onChange={(e) => setIdStudent(e.target.value)}
                            placeholder="Nhập mã số sinh viên..."
                        />

                        <div className="modal-actions">
                            <button className="btn btn-primary" onClick={handleIssueSubmit}>
                                Cấp thẻ
                            </button>
                            <button className="btn btn-secondary" onClick={handleIssueCancel}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= */}
            {/* MODAL HỦY YÊU CẦU */}
            {/* ================= */}
            {isCancelModalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Xác nhận hủy yêu cầu</h3>
                        <p>
                            Bạn có chắc muốn hủy yêu cầu của{" "}
                            <b>{selectedUser?.fullName}</b> không?
                        </p>

                        <div className="modal-actions">
                            <button className="btn btn-danger" onClick={handleCancelSubmit}>
                                Xác nhận
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsCancelModalVisible(false)}
                            >
                                Không
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardIssuanceManagement;
