const User = require('../models/users.model');
const Product = require('../models/product.model')
const History = require('../models/historyBook.model');
const Reminder = require('../models/reminder.model')
const { createRefreshToken, createToken, verifyToken } = require('../services/tokenServices');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const { Op, where } = require('sequelize');
require('dotenv').config();

class ControllerUser {
    // Đăng ký
    async registerUser(req, res) {
        try {
            const { fullName, phone, address, email, password } = req.body;
            if (!fullName || !email || !password) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại" });
            }

            const salt = bcrypt.genSaltSync(10);
            const passHash = bcrypt.hashSync(password, salt);

            const newUser = await User.create({
                fullName,
                phone,
                address,
                email,
                password: passHash,
            });

            const token = await createToken({ id: newUser.id });
            const refreshToken = await createRefreshToken({ id: newUser.id });

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 15 * 60 * 1000
            });
            res.cookie('logged', 1, {
                httpOnly: false,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(201).json({
                status: 'success',
                message: 'Đăng ký thành công',
                data: { token, refreshToken }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Đăng nhập
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

            if (email === 'admin@gmail.com' && password === '123456') {
                return res.status(200).json({
                    status: 'success',
                    message: 'Đăng nhập admin thành công!',
                    data: { redirectTo: '/admin' }
                });
            }

            const findUser = await User.findOne({ where: { email } });
            if (!findUser)
                return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không chính xác" });

            const pass = bcrypt.compareSync(password, findUser.password);
            if (!pass)
                return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không hợp lệ' });

            const token = await createToken({ id: findUser.id });
            const refreshToken = await createRefreshToken({ id: findUser.id });

            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.cookie('logged', 1, { httpOnly: false, secure: true, sameSite: 'Strict' });

            return res.status(200).json({
                status: 'success',
                message: 'Đăng nhập thành công',
                data: { token, refreshToken, redirectTo: '/' },
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Xác thực
    async authUser(req, res) {
        try {
            const { id } = req.user;
            const findUser = await User.findOne({ where: { id } });
            if (!findUser) return res.status(401).json({ message: "Tài khoản không tồn tại" });

            const encrypt = CryptoJS.AES.encrypt(JSON.stringify(findUser), process.env.SECRET_CRYPTO).toString();
            return res.status(200).json({ status: 'success', message: 'success', data: encrypt });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Refresh Token
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken)
                return res.status(401).json({ message: 'Không tìm thấy refresh token' });

            const decoded = await verifyToken(refreshToken);
            const user = await User.findOne({ where: { id: decoded.id } });
            const token = await createToken({ id: user.id });

            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            return res.status(200).json({ status: 'success', message: 'Làm mới token thành công', data: { token } });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Đăng xuất
    async logout(req, res) {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.clearCookie('logged');
        return res.status(200).json({ status: 'success', message: 'Bạn đã đăng xuất' });
    }

    // Cập nhật thông tin người dùng
    async updateInfoUser(req, res) {
        try {
            const { id } = req.user;
            const { fullName, address, phone } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

            await user.update({ fullName, address, phone });
            return res.status(200).json({ status: 'success', message: 'Cập nhật thông tin thành công' });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Danh sách user
    async getUsers(req, res) {
        const users = await User.findAll({
            order: [['borrowed', 'DESC']]
        });
        return res.status(200).json({ status: 'success', message: 'Lấy thông tin thành công', data: users });
    }

    // Admin update user
    async updateUser(req, res) {
        const { userId, fullName, email, role } = req.body;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        await user.update({ fullName, email, role });
        return res.status(200).json({ status: 'success', message: 'Cập nhật người dùng thành công' });
    }

    // Xóa user
    async deleteUser(req, res) {
        const { userId } = req.body;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        await user.destroy();
        return res.status(200).json({ status: 'success', message: 'Xóa người dùng thành công' });
    }

    // Request ID
    async requestIdStudent(req, res) {
        const { id } = req.user;
        const user = await User.findOne({ where: { id } });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        if (user.idStudent !== null && user.idStudent === '0') {
            return res.status(400).json({ message: 'Vui lòng chờ xác nhận ID sinh viên' });
        }

        user.idStudent = '0';
        await user.save();

        return res.status(200).json({ status: 'success', message: 'Yêu cầu thành công' });
    }

    async confirmIdStudent(req, res) {
        const { idStudent, userId } = req.body;
        if (!idStudent || idStudent === '0') return res.status(400).json({ message: 'Vui lòng nhập ID sinh viên hợp lệ' });

        const user = await User.findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        user.idStudent = idStudent;
        user.cardStatus = 'active';   // ⭐ Ghi trạng thái đã duyệt
        await user.save();
        return res.status(200).json({ status: 'success', message: 'Xác nhận thành công' });

    }

    // Biểu đồ thống kê
    async getStatistics(req, res) {
        try {
            const totalUsers = await User.count();
            const totalBooks = await Product.count();
            const pendingRequests = await History.count({ where: {status: 'pending'}});
            const bookInStock = await Product.count({ where: { stock: { [Op.gt] : 0 }}});
            const booksOutOfStock = totalBooks - bookInStock;
            const bookStatus = [
                {type: 'Còn sách', value: bookInStock },
                {type: 'Hết sách', value: booksOutOfStock }
            ]
            const aprovedBooks = await History.count( { where: {status: 'success' } });
            const rejectedBooks = await History.count({ where: {status: 'cancel' } });
            const expiredDay = new Date();
            expiredDay.setDate(expiredDay.getDate() - 7);
            const expiredBooks = await History.count({ where: {status: 'success', returnDate: { [Op.lt]: expiredDay } }} );
            const  booksData = [
                { status: 'Đã duyệt', count: aprovedBooks },
                { status: 'Chờ duyệt', count: pendingRequests },
                { status: 'Từ chối', count: rejectedBooks },
                { status: 'Quá hạn', count: expiredBooks },
            ]
            return res.status(200).json({
                status: 'success',
                message: 'Lấy thống kê thành công',
                data: { totalUsers, totalBooks, pendingRequests, bookStatus, booksData },
            });
        }catch(err) {
            console.error(err);
            res.status(500).json({ message: 'Lỗi server'});
        }
        
    }
    async cancelRequestIdStudent(req, res) {
    try {
        const { userId } = req.body;

        const user = await User.findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        // Chỉ hủy nếu đang chờ cấp
        if (user.idStudent !== '0') {
            return res.status(400).json({ message: "Không thể hủy vì yêu cầu không ở trạng thái chờ" });
        }

        user.idStudent = null;
        await user.save();

        return res.status(200).json({ status: "success", message: "Đã hủy yêu cầu cấp thẻ" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi server" });
    }
}


    // Danh sách chờ cấp mã
    async getListRequest(req, res) {
        const requestList = await User.findAll({
            // where: { idStudent: '0' },
             where: { idStudent: { [Op.ne]: null } },
            attributes: ['id', 'fullName', 'email', 'phone', 'idStudent', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).json({ status: 'success', message: 'success', data: requestList });
    }


    ////////////////////////////UPDATE///////////////////////////////////////////////////////





    // Tính tiền phạt khi quá hạn mượn sách
    async calculateFine(req, res) {
            try {
                const { idHistory } = req.body;

                const history = await History.findOne({ where: { id: idHistory } });
                if (!history) {
                    return res.status(404).json({ success: false, message: 'Lịch sử mượn không tồn tại' });
                }
                const today = new Date();
                const returnDate = new Date(history.returnDate);

                // Tính số ngày quá hạn
                const diffDays = Math.floor((today - returnDate) / (1000 * 60 * 60 * 24));

                const fine = 5000; 
                const totalFine = diffDays > 0 ? diffDays * fine : 0;
                await history.update({fine: totalFine });
                res.status(200).json({
                    success: true,
                    message: 'Tính tiền phạt thành công',
                    data: {
                        daysOverdue: diffDays > 0 ? diffDays : 0,
                        totalFine,
                    },
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Lỗi server' });
            }
        }
    
    // User trả sách
    async returnBoook(req, res) {
        try{
        const { id } = req.user;
        const { bookId, idHistory } = req.body;
        const findUser = await User.findOne({ where: { id }});
        const history = await History.findOne({ where: { id: idHistory } });
        const product = await Product.findOne({ where: { id: bookId }});

        await product.update({
            stock: product.stock + history.quantity,
        })

        await findUser.update({
            returned: findUser.returned + history.quantity,
        })

        await history.update({
            status: 'returned',
            returnDate: new Date()
        })
        return res.status(200).json({
            success: true,
            message: "Trả sách thành công"
        });
        }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
    }


    // Nút nhắc User trả sách

    async sendReminder(req, res) {
        try {
            const { idHistory } = req.body;

            const history = await History.findOne({ where: { id: idHistory } });
            if (!history) {
                return res.status(404).json({ success: false, message: 'Lịch sử mượn không tồn tại' });
            }
            const user = await User.findOne({ where: {id: history.userId }});

            const message = `Xin chào ${user.fullName}, Bạn đã mượn sách quá hạn thời gian, vui lòng thanh toán phí phạt và trả sách `;

            await Reminder.create({
                userId: user.id,
                historyId: history.id,
                message
            });

            return res.status(200).json({
                success: true,
                message: 'Đã gửi nhắc nhở thành công',
                data: { reminderText: message }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }


    // User xem tất cả các lời nhắc nhở đó 

    async getReminders(req, res) {
    try {
        const { id } = req.user; // lấy từ token

        const reminders = await Reminder.findAll({
            where: { userId: id },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: reminders
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
}




}

module.exports = new ControllerUser();
