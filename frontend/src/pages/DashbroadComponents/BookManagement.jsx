import React, { useEffect, useState } from 'react';
import './BookManagement.css';
import { Table, Button, Input, Modal, Form, InputNumber, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
    requestCreateProduct,
    requestDeleteProduct,
    requestGetAllProduct,
    requestUpdateProduct,
    requestUploadImageProduct,
} from '../../config/request';


const { Option } = Select;

// Component Form sách để tái sử dụng
const BookForm = ({ form, onFinish, initialValues, isEdit = false }) => {
    useEffect(() => {
        if (initialValues) {
            // Xử lý dữ liệu cho edit form
            const formValues = { ...initialValues };

            // Nếu là edit và có ảnh, tạo file list cho Upload component
            if (isEdit && initialValues.image) {
                formValues.image = {
                    fileList: [
                        {
                            uid: '-1',
                            name: 'current-image',
                            status: 'done',
                            url: initialValues.image.startsWith('http')
                                ? initialValues.image
                                : `${import.meta.env.VITE_API_URL}/${initialValues.image}`,
                        },
                    ],
                };
            }

            form.setFieldsValue(formValues);
        }
    }, [initialValues, form, isEdit]);

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Form.Item
                name="image"
                label="Ảnh bìa"
                rules={[{ required: !isEdit, message: 'Vui lòng tải lên ảnh bìa!' }]}
            >
                <Upload
                    name="image"
                    listType="picture"
                    beforeUpload={() => false}
                    maxCount={1}
                    defaultFileList={
                        isEdit && initialValues?.image
                            ? [
                                  {
                                      uid: '-1',
                                      name: 'current-image',
                                      status: 'done',
                                      url: initialValues.image.startsWith('http')
                                          ? initialValues.image
                                          : `${import.meta.env.VITE_API_URL}/${initialValues.image}`,
                                  },
                              ]
                            : []
                    }
                >
                    <Button icon={<UploadOutlined />}>{isEdit ? 'Thay đổi ảnh' : 'Tải lên'}</Button>
                </Upload>
            </Form.Item>
            <Form.Item
                name="nameProduct"
                label="Tên sách"
                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="publisher"
                label="Nhà xuất bản"
                rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="publishYear"
                label="Năm xuất bản"
                rules={[{ required: true, message: 'Vui lòng nhập năm xuất bản!' }]}
            >
                <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="stock" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                name="covertType"
                label="Loại bìa"
                rules={[{ required: true, message: 'Vui lòng chọn loại bìa!' }]}
            >
                <Select placeholder="Chọn loại bìa">
                    <Option value="hard">Bìa cứng</Option>
                    <Option value="soft">Bìa mềm</Option>
                </Select>
            </Form.Item>
            <Form.Item name="pages" label="Số trang" rules={[{ required: true, message: 'Vui lòng nhập số trang!' }]}>
                <InputNumber className="w-full" min={1} />
            </Form.Item>
            <Form.Item
                name="language"
                label="Ngôn ngữ"
                rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="publishingCompany"
                label="Công ty phát hành"
                rules={[{ required: true, message: 'Vui lòng nhập công ty phát hành!' }]}
            >
                <Input />
            </Form.Item>
        </Form>
    );
};

const BookManagement = () => {
    const [data, setData] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [deletingBook, setDeletingBook] = useState(null);
    const [loading, setLoading] = useState(false);

    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await requestGetAllProduct();
            setData(res.data);
        } catch (error) {
            console.error('Failed to fetch books:', error);
            message.error('Không thể tải dữ liệu sách');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Xử lý cho Modal Thêm Sách ---
    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleAddOk = () => {
        addForm.submit();
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
        addForm.resetFields();
    };

    const onAddFinish = async (values) => {
        try {
            setLoading(true);

            if (!values.image?.fileList || values.image.fileList.length === 0) {
                message.error('Vui lòng chọn ảnh bìa');
                return;
            }

            const formData = new FormData();
            formData.append('image', values.image.fileList[0].originFileObj);

            const urlImage = await requestUploadImageProduct(formData);
            const data = {
                ...values,
                image: urlImage.data,
            };

            await requestCreateProduct(data);
            message.success('Thêm sách thành công');
            handleAddCancel();
            fetchData();
        } catch (error) {
            console.error('Add product error:', error);
            message.error('Không thể thêm sách');
        } finally {
            setLoading(false);
        }
    };

    // --- Xử lý cho Modal Sửa Sách ---
    const showEditModal = (record) => {
        setEditingBook(record);
        setIsEditModalVisible(true);
    };

    const handleEditOk = () => {
        editForm.submit();
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingBook(null);
        editForm.resetFields();
    };

    const onEditFinish = async (values) => {
        try {
            setLoading(true);
            let imageUrl = editingBook.image; // Giữ ảnh cũ mặc định

            // Kiểm tra nếu có ảnh mới được upload
            if (values.image?.fileList && values.image.fileList.length > 0) {
                const newFile = values.image.fileList[0];

                // Chỉ upload nếu có file mới (không phải ảnh cũ)
                if (newFile.originFileObj) {
                    const formData = new FormData();
                    formData.append('image', newFile.originFileObj);
                    const urlImage = await requestUploadImageProduct(formData);
                    imageUrl = urlImage.data;
                }
            }

            const updateData = {
                ...values,
                image: imageUrl,
            };

            await requestUpdateProduct(editingBook.id, updateData);
            message.success('Cập nhật sách thành công');
            handleEditCancel();
            fetchData();
        } catch (error) {
            console.error('Update product error:', error);
            message.error('Không thể cập nhật sách');
        } finally {
            setLoading(false);
        }
    };

    // --- Xử lý cho Modal Xóa Sách ---
    const showDeleteModal = (record) => {
        setDeletingBook(record);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteOk = async () => {
        try {
            setLoading(true);
            await requestDeleteProduct(deletingBook.id);
            message.success('Xóa sách thành công');
            fetchData();
            handleDeleteCancel();
        } catch (error) {
            console.error('Delete product error:', error);
            message.error('Không thể xóa sách');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setDeletingBook(null);
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (text) => (
                <img
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    src={text?.startsWith('http') ? text : `${import.meta.env.VITE_API_URL_IMAGE}/${text}`}
                    alt="book cover"
                    onError={(e) => {
                        e.target.src = '/placeholder-book.png'; // Fallback image
                    }}
                />
            ),
        },
        {
            title: 'Tên sách',
            dataIndex: 'nameProduct',
            key: 'nameProduct',
            ellipsis: true,
            width: 200,
        },
        {
            title: 'Nhà xuất bản',
            dataIndex: 'publisher',
            key: 'publisher',
            ellipsis: true,
            width: 150,
        },
        {
            title: 'Năm xuất bản',
            dataIndex: 'publishYear',
            key: 'publishYear',
            width: 120,
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
            width: 100,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <span className="flex gap-2">
                    <Button type="primary" size="small" onClick={() => showEditModal(record)} loading={loading}>
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => showDeleteModal(record)}
                        loading={loading}
                    >
                        Xóa
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div className="book-management">
            <div className="header">
                <h2>Quản lý sách</h2>
                <Button type="primary" onClick={showAddModal} loading={loading}>
                    Thêm sách
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sách`,
                }}
            />

            {/* Modal Thêm Sách */}
            <Modal
                title="Thêm sách mới"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                okText="Thêm"
                cancelText="Hủy"
                width={800}
                confirmLoading={loading}
            >
                <BookForm form={addForm} onFinish={onAddFinish} />
            </Modal>

            {/* Modal Sửa Sách */}
            <Modal
                title="Chỉnh sửa thông tin sách"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={800}
                confirmLoading={loading}
            >
                <BookForm form={editForm} onFinish={onEditFinish} initialValues={editingBook} isEdit={true} />
            </Modal>

            {/* Modal Xóa Sách */}
            <Modal
                title="Xác nhận xóa sách"
                open={isDeleteModalVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                confirmLoading={loading}
            >
                <p>Bạn có chắc chắn muốn xóa sách "{deletingBook?.nameProduct}" không?</p>
            </Modal>
        </div>
    );
};

export default BookManagement;