import React, { useEffect, useState } from 'react';
import './BookManagement.css';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// Import API
import {
    requestCreateProduct,
    requestDeleteProduct,
    requestGetAllProduct,
    requestUpdateProduct,
    requestUploadImageProduct,
} from '../../config/request';

const { Option } = Select;

/* ============================================================
   📌 FORM SÁCH – CHIA RIÊNG COMPONENT
   Form này được tái sử dụng cho Thêm + Sửa
   ============================================================ */
const BookForm = ({ form, initialValues = null, isEdit }) => {
    
    // Khi mở modal EDIT → tự fill form
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                image: initialValues.image
                    ? {
                          fileList: [
                              {
                                  uid: '-1',
                                  name: 'current-image',
                                  status: 'done',
                                  url: initialValues.image.startsWith("http")
                                      ? initialValues.image
                                      : `${import.meta.env.VITE_API_URL}/${initialValues.image}`,
                              },
                          ],
                      }
                    : [],
            });
        }
    }, [initialValues]);

    return (
        <Form form={form} layout="vertical">
            {/* Ảnh bìa */}
            <Form.Item
                name="image"
                label="Ảnh bìa"
                rules={[{ required: !isEdit, message: 'Vui lòng tải ảnh!' }]}
            >
                <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
                    <Button icon={<UploadOutlined />}>{isEdit ? 'Đổi ảnh' : 'Tải lên'}</Button>
                </Upload>
            </Form.Item>

            {/* Tên sách */}
            <Form.Item name="nameProduct" label="Tên sách" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            {/* Nhà xuất bản */}
            <Form.Item name="publisher" label="Nhà xuất bản" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            {/* Năm xuất bản */}
            <Form.Item name="publishYear" label="Năm xuất bản" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>

            {/* Số lượng */}
            <Form.Item name="stock" label="Số lượng" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={0} />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
                <Input.TextArea />
            </Form.Item>

            {/* Loại bìa */}
            <Form.Item name="covertType" label="Loại bìa" rules={[{ required: true }]}>
                <Select>
                    <Option value="hard">Bìa cứng</Option>
                    <Option value="soft">Bìa mềm</Option>
                </Select>
            </Form.Item>

            <Form.Item name="pages" label="Số trang" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={1} />
            </Form.Item>

            <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="publishingCompany" label="Công ty phát hành" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
        </Form>
    );
};



/* ============================================================
   📌 COMPONENT CHÍNH: BOOK MANAGEMENT
   ============================================================ */
const BookManagement = () => {

    // Danh sách sách
    const [data, setData] = useState([]);

    // 1 modal dùng chung cho thêm + sửa
    const [modalOpen, setModalOpen] = useState(false);

    // Nếu null = thêm, có giá trị = sửa
    const [editingBook, setEditingBook] = useState(null);

    // Loading cho toàn trang
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();


    /* ============================================================
       📌 Load danh sách sách từ API
       ============================================================ */
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await requestGetAllProduct();
            setData(res.data);
        } catch (err) {
            message.error("Không thể tải dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    // Load ngay khi vào trang
    useEffect(() => {
        fetchData();
    }, []);


    /* ============================================================
       📌 Mở modal thêm sách
       ============================================================ */
    const openAddModal = () => {
        setEditingBook(null);       // null = thêm mới
        form.resetFields();         // reset form
        setModalOpen(true);
    };

    /* ============================================================
       📌 Mở modal sửa sách
       ============================================================ */
    const openEditModal = (record) => {
        setEditingBook(record);
        setModalOpen(true);
    };


    /* ============================================================
       📌 Xử lý Submit Form (Thêm + Sửa)
       ============================================================ */
    const handleSubmit = async () => {
        const values = await form.validateFields();

        try {
            setLoading(true);

            let imageUrl = editingBook?.image;  // Giữ ảnh cũ nếu không đổi

            // Nếu có ảnh mới thì upload
            const file = values.image?.fileList?.[0];
            if (file?.originFileObj) {
                const fd = new FormData();
                fd.append("image", file.originFileObj);
                const uploaded = await requestUploadImageProduct(fd);
                imageUrl = uploaded.data;
            }

            const payload = { ...values, image: imageUrl };

            if (editingBook) {
                // 🔥 Sửa sách
                await requestUpdateProduct(editingBook.id, payload);
                message.success("Cập nhật sách thành công!");
            } else {
                // 🔥 Thêm sách
                await requestCreateProduct(payload);
                message.success("Thêm sách thành công!");
            }

            setModalOpen(false);
            fetchData();        // reload dữ liệu

        } catch (err) {
            message.error("Lỗi thao tác!");
        } finally {
            setLoading(false);
        }
    };


    /* ============================================================
       📌 Xử lý xóa sách
       ============================================================ */
    const deleteBook = (record) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn muốn xóa sách: ${record.nameProduct}?`,
            okText: "Xóa",
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    setLoading(true);
                    await requestDeleteProduct(record.id);
                    message.success("Xóa thành công!");
                    fetchData();
                } catch {
                    message.error("Không thể xóa!");
                } finally {
                    setLoading(false);
                }
            }
        });
    };


    /* ============================================================
       📌 Cấu hình cột bảng
       ============================================================ */
    const columns = [
        {
            title: "Ảnh",
            dataIndex: "image",
            render: (img) => (
                <img
                    src={img?.startsWith("http") ? img : `${import.meta.env.VITE_API_URL_IMAGE}/${img}`}
                    className="book-image"
                    onError={(e) => (e.target.src = "/placeholder-book.png")}
                />
            ),
            width: 100
        },
        {
            title: "Tên sách",
            dataIndex: "nameProduct"
        },
        {
            title: "Nhà xuất bản",
            dataIndex: "publisher"
        },
        {
            title: "Năm",
            dataIndex: "publishYear",
            width: 80
        },
        {
            title: "Số lượng",
            dataIndex: "stock",
            width: 100
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button size="small" type="primary" onClick={() => openEditModal(record)}>
                        Sửa
                    </Button>
                    <Button size="small" danger type="primary" onClick={() => deleteBook(record)}>
                        Xóa
                    </Button>
                </div>
            )
        }
    ];


    return (
        <div className="book-management">
            {/* Header */}
            <div className="header">
                <h2>Quản lý sách</h2>
                <Button type="primary" onClick={openAddModal}>
                    Thêm sách
                </Button>
            </div>

            {/* Bảng sách */}
            <Table
                loading={loading}
                dataSource={data}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            {/* Modal Thêm + Sửa */}
            <Modal
                title={editingBook ? "Chỉnh sửa sách" : "Thêm sách"}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                width={800}
                confirmLoading={loading}
            >
                <BookForm
                    form={form}
                    initialValues={editingBook}
                    isEdit={!!editingBook}
                />
            </Modal>
        </div>
    );
};

export default BookManagement;
