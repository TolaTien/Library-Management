import React, { useEffect, useState } from 'react';
import './BookManagement.css';
import {
    requestCreateProduct,
    requestDeleteProduct,
    requestGetAllProduct,
    requestUpdateProduct,
    requestUploadImageProduct,
} from '../../config/request';

const BookForm = ({ formData, setFormData, onSubmit, isEdit }) => {//tạo ra object mới bằng cách coppy dữ liệu cũ
    return (
        <form className="form">
            <div className="form-group">
                <label>Ảnh bìa</label>
                <input
                    type="file"
                    onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                    }//chọn ảnh lấy file và lưu vào formData
                />
                {isEdit && formData.imageUrl && (
                    <img className="preview-img" src={formData.imageUrl} />
                )}//nếu sửa  thì hiển thị ảnh cũ
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
        </form>//chỉ chạy hàm onSubmit do cha chuyền vào,hay gửi dữ liệu api
    );
};

const BookManagement = () => {
    const [data, setData] = useState([]);//mảng ds láy từ server
    const [filterCategory, setFilterCategory] = useState("all");//giá trị select lọc theo thể loại
    const [categories, setCategories] = useState([]);//ds thể loại duy nhất lấy từ data
    //hiện 3 modal thêm,sửa,xóa
    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const [formData, setFormData] = useState({});//dữ liệu form thêm,sửa
    const [selectedBook, setSelectedBook] = useState(null);//

    const fetchData = async () => {
        const res = await requestGetAllProduct();
        setData(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);//Khi mount, gọi API lấy tất cả sách.

    useEffect(() => {
        const unique = [...new Set(data.map(i => i.category))];
        setCategories(unique);
    }, [data]);//Tạo danh sách thể loại duy nhất khi data thay đổi.

    const filteredData = data.filter(i =>
        filterCategory === "all" ? true : i.category === filterCategory
    );//lọc data
    //hàm xử lý khi người dùng bấm nút "Thêm sách".
    const handleAddSubmit = async () => {
        const fd = new FormData();//tạo form data để upload ảnh
        fd.append("image", formData.image);//thêm file ảnh

        const urlImg = await requestUploadImageProduct(fd);//up ảnh lên server

        const payload = { ...formData, image: urlImg.data };//tạo payload gửi lên server

        await requestCreateProduct(payload);
        setModalAdd(false);
        setFormData({});
        fetchData();
    };
    //hàm sử dụng khi người dùng bấm nút form sửa
    const handleEditSubmit = async () => {
        let imageUrl = selectedBook.image;//lấy url ảnh cũ

        if (formData.image instanceof File) {//nếu chọn ảnh mới
            const fd = new FormData();
            fd.append("image", formData.image);
            const res = await requestUploadImageProduct(fd);
            imageUrl = res.data;
        }
        //gửi dữ liệu đã sửa lên server
        await requestUpdateProduct(selectedBook.id, {
            ...formData,
            image: imageUrl,
        });

        setModalEdit(false);
        setFormData({});
        fetchData();
    };
    //hàm xóa sách 
    const handleDelete = async () => {
        await requestDeleteProduct(selectedBook.id);
        setModalDelete(false);
        fetchData();
    };
    //giao diện UI chính
    return (
        <div className="book-container">

            <div className="header">
                <h2>Quản lý sách</h2>
                <div className="header-actions">
                    <select
                        value={filterCategory}//lọc theo thể loại
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

            <table className="table">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên sách</th>
                        <th>NXB</th>
                        <th>Năm</th>
                        <th>Số lượng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((b) => (//lặp qua ds sách đã lọc
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
                            <td>//nút sửa xóa
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

            {/* Modal Add  hiện khi midalAdd === true*/}
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

            {/* Modal Edit */}
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

            {/* Modal Delete */}
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