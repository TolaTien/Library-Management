import React, { useEffect, useState } from "react";
import {
    requestDeleteUser,
    requestGetAllUsers,
    requestUpdateUserAdmin
} from "../../config/request";
import "./UserManagement.css";

const UserManagement = () => {
    const [data, setData] = useState([]);

    // Modal
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        role: "user",
    });

    const fetchData = async () => {
        const res = await requestGetAllUsers();
        setData(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openEdit = (record) => {
        setEditingUser(record);
        setForm({
            fullName: record.fullName,
            email: record.email,
            role: record.role,
        });
        setShowEdit(true);
    };

    const openDelete = (record) => {
        setDeletingUser(record);
        setShowDelete(true);
    };

    const handleUpdateUser = async () => {
        const body = {
            userId: editingUser.id,
            ...form,
        };

        await requestUpdateUserAdmin(body);
        setShowEdit(false);
        fetchData();
    };

    const handleDeleteUser = async () => {
        await requestDeleteUser({ userId: deletingUser.id });
        setShowDelete(false);
        fetchData();
    };

    return (
        <div className="user-management">
            <h2 className="title">Quản lý người dùng</h2>

            {/* TABLE */}
            <div className="table-wrapper">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên người dùng</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Đã mượn</th>
                            <th>Đã trả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.fullName}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`role-tag ${u.role}`}>
                                        {u.role === "admin" ? "Admin" : "Người dùng"}
                                    </span>
                                </td>
                                <td>{u.borrowed}</td>
                                <td>{u.returned}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-small btn-primary"
                                            onClick={() => openEdit(u)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className="btn-small btn-danger"
                                            onClick={() => openDelete(u)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*  EDIT MODAL */}
            {showEdit && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <h3 className="modal-title">Sửa người dùng</h3>

                        <label className="input-label">Tên người dùng</label>
                        <input
                            className="input"
                            value={form.fullName}
                            onChange={(e) =>
                                setForm({ ...form, fullName: e.target.value })
                            }
                        />

                        <label className="input-label">Email</label>
                        <input
                            className="input"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

                        <label className="input-label">Vai trò</label>
                        <select
                            className="select"
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value })
                            }
                        >
                            <option value="user">Người dùng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>

                        <div className="modal-actions">
                            <button
                                className="btn-primary"
                                onClick={handleUpdateUser}
                            >
                                Lưu
                            </button>
                            <button className="btn-outline" onClick={() => setShowEdit(false)}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*  DELETE MODAL */}
            {showDelete && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <h3 className="modal-title">Xóa người dùng</h3>

                        <p>
                            Bạn có chắc chắn muốn xóa người dùng{" "}
                            <b>{deletingUser.fullName}</b> không?
                        </p>

                        <div className="modal-actions">
                            <button
                                className="btn-danger"
                                onClick={handleDeleteUser}
                            >
                                Xóa
                            </button>
                            <button className="btn-outline" onClick={() => setShowDelete(false)}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;