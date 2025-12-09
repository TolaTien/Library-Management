import React, { useEffect, useState } from 'react';
import './BookManagement.css';
import {
    requestCreateProduct,
    requestDeleteProduct,
    requestGetAllProduct,
    requestUpdateProduct,
    requestUploadImageProduct,
} from '../../config/request';

const BookForm = ({ formData, setFormData, onSubmit, isEdit }) => {
    return (
        <form className="form">
            <div className="form-group">
                <label>Ảnh bìa</label>
                <input
                    type="file"
                    onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                    }
                />
                {isEdit && formData.imageUrl && (
                    <img className="preview-img" src={formData.imageUrl} />
                )}
            </div>

            <div className="form-group">
                <label>Tên sách</label>
                <input
                    value={formData.nameProduct || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, nameProduct: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Nhà xuất bản</label>
                <input
                    value={formData.publisher || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, publisher: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Năm xuất bản</label>
                <input
                    type="number"
                    value={formData.publishYear || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, publishYear: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Số lượng</label>
                <input
                    type="number"
                    value={formData.stock || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Mô tả</label>
                <textarea
                    value={formData.description || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Thể loại</label>
                <input
                    value={formData.category || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Số trang</label>
                <input
                    type="number"
                    value={formData.pages || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, pages: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Ngôn ngữ</label>
                <input
                    value={formData.language || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                    }
                />
            </div>

            <div className="form-group">
                <label>Công ty phát hành</label>
                <input
                    value={formData.publishingCompany || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, publishingCompany: e.target.value })
                    }
                />
            </div>

            <button
                type="button"
                className="btn btn-primary full"
                onClick={onSubmit}
            >
                {isEdit ? 'Lưu thay đổi' : 'Thêm sách'}
            </button>
        </form>
    );
};

const BookManagement = () => {
    const [data, setData] = useState([]);
    const [filterCategory, setFilterCategory] = useState("all");
    const [categories, setCategories] = useState([]);

    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const [formData, setFormData] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);

    // Sắp xếp stock
    const [sortOrder, setSortOrder] = useState("none"); // none | asc | desc

    const toggleSortStock = () => {
        setSortOrder(prev => {
            if (prev === "none") return "asc";
            if (prev === "asc") return "desc";
            return "none";
        });
    };

    const fetchData = async () => {
        const res = await requestGetAllProduct();
        setData(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const unique = [...new Set(data.map(i => i.category))];
        setCategories(unique);
    }, [data]);

    const filteredData = data.filter(i =>
        filterCategory === "all" ? true : i.category === filterCategory
    );

    // Áp dụng sort
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortOrder === "asc") return a.stock - b.stock;
        if (sortOrder === "desc") return b.stock - a.stock;
        return 0;
    });

    const handleAddSubmit = async () => {
        const fd = new FormData();
        fd.append("image", formData.image);

        const urlImg = await requestUploadImageProduct(fd);
        const payload = { ...formData, image: urlImg.data };

        await requestCreateProduct(payload);
        setModalAdd(false);
        setFormData({});
        fetchData();
    };

    const handleEditSubmit = async () => {
        let imageUrl = selectedBook.image;

        if (formData.image instanceof File) {
            const fd = new FormData();
            fd.append("image", formData.image);
            const res = await requestUploadImageProduct(fd);
            imageUrl = res.data;
        }

        await requestUpdateProduct(selectedBook.id, {
            ...formData,
            image: imageUrl,
        });

        setModalEdit(false);
        setFormData({});
        fetchData();
    };

    const handleDelete = async () => {
        await requestDeleteProduct(selectedBook.id);
        setModalDelete(false);
        fetchData();
    };

    return (
        <div className="book-container">

            <div className="header">
                <h2>Quản lý sách</h2>
                <div className="header-actions">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">Tất cả thể loại</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={() => setModalAdd(true)}>
                        Thêm sách
                    </button>
                </div>
            </div>

            {/* BẢNG HIỂN THỊ */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên sách</th>
                        <th>NXB</th>
                        <th>Năm</th>

                        {/* SORT COLUMN */}
                        <th onClick={toggleSortStock} style={{ cursor: "pointer" }}>
                            Số lượng
                            {sortOrder === "asc" && " ▲"}
                            {sortOrder === "desc" && " ▼"}
                        </th>

                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedData.map((b) => (
                        <tr key={b.id}>
                            <td>
                                <img
                                    className="book-img"
                                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${b.image}`}
                                />
                            </td>
                            <td>{b.nameProduct}</td>
                            <td>{b.publisher}</td>
                            <td>{b.publishYear}</td>
                            <td>{b.stock}</td>

                            <td>
                                <button
                                    className="btn btn-small"
                                    onClick={() => {
                                        setSelectedBook(b);
                                        setFormData({ ...b, imageUrl: b.image });
                                        setModalEdit(true);
                                    }}
                                >
                                    Sửa
                                </button>

                                <button
                                    className="btn btn-danger btn-small"
                                    onClick={() => {
                                        setSelectedBook(b);
                                        setModalDelete(true);
                                    }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL ADD */}
            {modalAdd && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Thêm sách mới</h3>
                        <BookForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleAddSubmit}
                        />
                        <button className="btn btn-secondary" onClick={() => setModalAdd(false)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL EDIT */}
            {modalEdit && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Chỉnh sửa sách</h3>
                        <BookForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleEditSubmit}
                            isEdit={true}
                        />
                        <button className="btn btn-secondary" onClick={() => setModalEdit(false)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL DELETE */}
            {modalDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Bạn có chắc muốn xóa?</h3>
                        <p>{selectedBook?.nameProduct}</p>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            Xóa
                        </button>
                        <button className="btn btn-secondary" onClick={() => setModalDelete(false)}>
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookManagement;
