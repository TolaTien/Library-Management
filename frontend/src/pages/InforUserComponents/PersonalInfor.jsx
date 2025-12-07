import  { useState, useEffect } from 'react';
import CustomCard from '../../cardbody/CustomCard';
import { requestIdStudent, requestUpdateUser } from '../../config/request';
import { toast } from 'react-toastify';
import { useStore } from '../../hooks/useStore';
import "./PersonalInfor.css"; // Nhớ import CSS mới

const PersonalInfo = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    // Thay thế Form.useForm() bằng state thường
    const [formData, setFormData] = useState({fullName: '',phone: '',address: ''});
    const { dataUser, setDataUser } = useStore();
    const safeDataUser = dataUser || {};

    useEffect(() => {
        if (dataUser) {
            // Đồng bộ dữ liệu vào state form khi có dataUser
            setFormData({
                fullName: dataUser.fullName || '',
                phone: dataUser.phone || '',
                address: dataUser.address || ''
            });
            setLoading(false);
        }
    }, [dataUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRequestStudentId = async () => {
        try {
            const res = await requestIdStudent();
            toast.success(res.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi gửi yêu cầu");
        }
    };

    const onSubmitUpdate = async (e) => {
        e.preventDefault(); // Chặn reload trang của form HTML
        // validate
        if (!formData.fullName.trim()) {
            toast.error('Vui lòng nhập họ tên!');
            return;
        }

        setLoading(true);
        try {
            await requestUpdateUser(formData);
            setIsEditing(false);
            setDataUser({ ...dataUser, ...formData });
            toast.success('Cập nhật thông tin thành công');
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi cập nhật");
        } finally {
            setLoading(false);
        }
    };

    // Component Loading thay thế Spin
    if (loading && !dataUser) {
        return (
            <div className="loading-overlay">
                <div className="custom-spinner"></div> 
            </div>
        );
    }

    // Nút chỉnh sửa để đưa vào props extra của CustomCard
    const EditButton = (
        !isEditing && (
            <button 
                className="btn btn-default" 
                onClick={() => setIsEditing(true)} 
                disabled={loading}
            >
                ✏️ Chỉnh sửa
            </button>
        )
    );

    return (
        <CustomCard
            title="Thông tin cá nhân"
            className="personal-info-card"
            extra={EditButton}
        >
            <div className="personal-info-container">
                {/* Phần Avatar */}
                <div className="avatar-section">
                    {safeDataUser.avatar ? (
                        <img 
                            src={`${import.meta.env.VITE_API_URL}/${safeDataUser.avatar}`} 
                            alt="Avatar" 
                            className="profile-avatar"
                        />
                    ) : (
                        // Placeholder nếu không có ảnh
                        <div className="profile-avatar-placeholder">
                            {safeDataUser.fullName ? safeDataUser.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                    )}
                </div>

                {/* Phần Thông tin chi tiết */}
                <div className="details-section">
                    {isEditing ? (
                        // FORM CHỈNH SỬA (HTML Form chuẩn)
                        <form onSubmit={onSubmitUpdate}>
                            <div className="custom-form-group">
                                <label className="custom-label custom-label-required">Họ và tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="custom-input"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="custom-form-group">
                                <label className="custom-label">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="custom-input"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="custom-form-group">
                                <label className="custom-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="custom-input"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="action-buttons">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                                <button type="button" className="btn btn-default" onClick={() => setIsEditing(false)} disabled={loading}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    ) : (
                        // CHẾ ĐỘ XEM (View Mode)
                        <>
                            <div className="info-table">
                                <div className="info-row" style={{display: 'flex'}}>
                                    <div className="info-label">Họ và tên</div>
                                    <div className="info-value">{safeDataUser.fullName}</div>
                                </div>
                                <div className="info-row" style={{display: 'flex'}}>
                                    <div className="info-label">Email</div>
                                    <div className="info-value">{safeDataUser.email}</div>
                                </div>
                                <div className="info-row" style={{display: 'flex'}}>
                                    <div className="info-label">Số điện thoại</div>
                                    <div className="info-value">{safeDataUser.phone || 'Chưa cập nhật'}</div>
                                </div>
                                <div className="info-row" style={{display: 'flex'}}>
                                    <div className="info-label">Địa chỉ</div>
                                    <div className="info-value">{safeDataUser.address || 'Chưa cập nhật'}</div>
                                </div>
                                <div className="info-row" style={{display: 'flex', borderBottom: 'none'}}>
                                    <div className="info-label">Mã sinh viên</div>
                                    <div className="info-value">{safeDataUser.idStudent || 'Chưa có'}</div>
                                </div>
                            </div>

                            {!safeDataUser.idStudent && (
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleRequestStudentId}
                                    style={{marginTop: '10px'}}
                                >
                                    Gửi yêu cầu cấp mã sinh viên
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </CustomCard>
    );
};

export default PersonalInfo;