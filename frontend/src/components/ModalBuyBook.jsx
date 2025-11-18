import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Row,
    Space,
    Typography,
} from 'antd';
import { BookOutlined, CalendarOutlined, IdcardOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';
import { requestCreateHistoryBook } from '../config/request';
import { toast } from 'react-toastify';

// Import file CSS riêng
import './ModalBuyBook.css';

const { Title, Text } = Typography;

// Constants for date calculations
const BORROW_DURATION_MAX_DAYS = 30;

/**
 * A modal component for users to register to borrow a book.
 * The component's filename is `ModalBuyBook`, but its functionality is for borrowing.
 */
function ModalBuyBook({ visible, onCancel, bookData }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { dataUser } = useStore();

    const today = dayjs();
    const minReturnDate = today.add(1, 'day');
    const maxReturnDate = today.add(BORROW_DURATION_MAX_DAYS, 'day');

    // Effect to populate form with user and book data when the modal becomes visible.
    useEffect(() => {
        if (visible && dataUser) {
            form.setFieldsValue({
                quantity: 1,
                fullName: dataUser?.fullName || '',
                address: dataUser?.address || '',
                phoneNumber: dataUser?.phoneNumber || '',
                // studentId: dataUser?.idStudent || '',
                returnDate: minReturnDate, // Default return date
            });
        }
    }, [visible, dataUser, form, minReturnDate]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const borrowData = {
                ...values,
                bookId: bookData?.id,
                borrowDate: today.format('YYYY-MM-DD'),
                returnDate: values.returnDate.format('YYYY-MM-DD'),
            };

            try {
                await requestCreateHistoryBook(borrowData);
                toast.success('Đăng ký mượn sách thành công!');
            } catch (error) {
                console.error('Error submitting borrow request:', error);
                toast.error(error.response.data.message);
            }

            form.resetFields();
            onCancel();
        } catch (error) {
            console.error('Error submitting borrow request:', error);
            toast.error('Đăng ký mượn sách thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    // Validator for the return date picker
    const validateReturnDate = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Vui lòng chọn ngày trả!'));
        }
        if (value.isBefore(minReturnDate, 'day')) {
            return Promise.reject(new Error('Ngày trả phải sau ngày mượn ít nhất 1 ngày!'));
        }
        if (value.isAfter(maxReturnDate, 'day')) {
            return Promise.reject(new Error(`Thời gian mượn tối đa ${BORROW_DURATION_MAX_DAYS} ngày!`));
        }
        return Promise.resolve();
    };

    const isSubmitDisabled = !bookData || bookData.stock <= 0 || loading;

    return (
        <Modal
            title={
                // BEM: modal-borrow__title-wrapper
                <div className="modal-borrow__title-wrapper">
                    <BookOutlined className="modal-borrow__title-icon" />
                    {/* BEM: modal-borrow__title-text */}
                    <span className="modal-borrow__title-text">
                        Đăng ký mượn sách
                    </span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={800}
            className="borrow-book-modal"
            destroyOnHidden
        >
            {/* BEM: modal-borrow__content */}
            <div className="modal-borrow__content">
                {/* Book Information Section */}
                {bookData && (
                    <Card className="modal-borrow__card modal-borrow__card--book">
                        <Title level={4} className="modal-borrow__section-title">
                            Thông tin sách
                        </Title>
                        <Row gutter={16} align="middle">
                            {/* BEM: modal-borrow__book-image-col */}
                            <Col xs={24} sm={8} className="modal-borrow__book-image-col">
                                <Image
                                    src={`${import.meta.env.VITE_API_URL}/${bookData.image}`}
                                    alt={bookData.nameProduct}
                                    width={120}
                                    height={160}
                                    className="modal-borrow__book-image"
                                    preview={false}
                                />
                            </Col>
                            <Col xs={24} sm={16}>
                                <Space direction="vertical" size="small" className="w-full">
                                    <Title level={5} className="modal-borrow__book-name">
                                        {bookData.nameProduct}
                                    </Title>
                                    {/* BEM: modal-borrow__book-details */}
                                    <div className="modal-borrow__book-details">
                                        <span>
                                            Nhà xuất bản: <Text strong>{bookData.publisher}</Text>
                                        </span>
                                        <span>
                                            Số trang: <Text strong>{bookData.pages} trang</Text>
                                        </span>
                                        <span>
                                            Năm XB: <Text strong>{bookData.publishYear}</Text>
                                        </span>
                                        <span>
                                            Còn lại:{' '}
                                            {/* BEM: modal-borrow__stock-count */}
                                            <Text strong className="modal-borrow__stock-count">
                                                {bookData.stock} quyển
                                            </Text>
                                        </span>
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                )}

                <Divider className="modal-borrow__divider" />

                {/* Borrower Information Form */}
                <Card className="modal-borrow__card modal-borrow__card--borrower">
                    <Title level={4} className="modal-borrow__section-title">
                        👤 Thông tin người mượn
                    </Title>
                    <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} preserve={false}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                                        { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                                    ]}
                                >
                                    {/* BEM: modal-borrow__input */}
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Nhập họ và tên đầy đủ"
                                        className="modal-borrow__input"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="address" label="Địa chỉ">
                                    <Input prefix={<IdcardOutlined />} placeholder="Nhập địa chỉ" className="modal-borrow__input" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        {
                                            pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                                            message: 'Số điện thoại không hợp lệ!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        placeholder="Ví dụ: 0987654321"
                                        className="modal-borrow__input"
                                        maxLength={10}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="quantity"
                                    label="Số lượng"
                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                                >
                                    <InputNumber
                                        min={1}
                                        max={bookData?.stock}
                                        placeholder="Số lượng"
                                        prefix={<BookOutlined />}
                                        className="modal-borrow__input modal-borrow__input--number"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider className="modal-borrow__divider modal-borrow__divider--small" />

                        <Title level={5} className="modal-borrow__section-subtitle">
                            📅 Thời gian mượn
                        </Title>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Ngày mượn">
                                    {/* BEM: modal-borrow__input--disabled */}
                                    <Input
                                        value={today.format('DD/MM/YYYY')}
                                        disabled
                                        className="modal-borrow__input modal-borrow__input--disabled"
                                        prefix={<CalendarOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="returnDate"
                                    label="Ngày trả dự kiến"
                                    rules={[{ validator: validateReturnDate }]}
                                >
                                    {/* BEM: modal-borrow__datepicker */}
                                    <DatePicker
                                        className="modal-borrow__datepicker"
                                        placeholder="Chọn ngày trả"
                                        format="DD/MM/YYYY"
                                        showToday={false}
                                        disabledDate={(current) =>
                                            current &&
                                            (current.isBefore(minReturnDate, 'day') ||
                                                current.isAfter(maxReturnDate, 'day'))
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* BEM: modal-borrow__actions */}
                        <div className="modal-borrow__actions">
                            {/* BEM: modal-borrow__button */}
                            <Button onClick={handleCancel} className="modal-borrow__button modal-borrow__button--cancel">
                                Hủy bỏ
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="modal-borrow__button modal-borrow__button--submit"
                                disabled={isSubmitDisabled}
                            >
                                {loading ? 'Đang xử lý...' : ' Xác nhận mượn'}
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </Modal>
    );
}

// Rename export to reflect borrowing, although filename remains ModalBuyBook.jsx
export default ModalBuyBook;