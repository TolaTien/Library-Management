const History = require('../models/historyBook.model');
const User = require('../models/users.model');
const Product = require('../models/product.model');


class historyBookController {
    // Tạo lịch sử mượn sách
    async createHistoryBook(req, res) {
        try {
            const { id } = req.user; 
            const findUser = await User.findOne({ where: { id } });
            if (!findUser)
                return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' });

            if (!findUser.idStudent || findUser.idStudent === '0')
                return res.status(400).json({ success: false, message: 'Bạn cần có ID sinh viên' });

            const { bookId, borrowDate, returnDate, quantity } = req.body;
            if (!bookId || !borrowDate || !returnDate || !quantity) {
                return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
            }

            const successBorrow = await History.sum('quantity', {
                where: {
                    userId: id,
                    status: 'success'
                }
            });
            const totalSuccessBorrow = successBorrow || 0;

            if( totalSuccessBorrow - findUser.returned + quantity > 5) {
                return res.status(400).json({ success: false, message: 'Bạn đã mượn quá 5 cuốn sách' });
            }

            const findBook = await Product.findOne({ where: { id: bookId } }); 
            if (!findBook)
                return res.status(400).json({ success: false, message: 'Không tìm thấy sách' }); 

            if (findBook.stock < quantity)
                return res.status(400).json({ success: false, message: 'Số lượng sách không đủ' });

            // Lấy thông tin user từ DB
            const { fullName, phone, address } = findUser;

            const historyBook = await History.create({
                fullName,
                phone,
                address,
                bookId,
                borrowDate,
                returnDate,
                quantity,
                userId: id,
            });

            return res.status(200).json({
                success: true,
                message: 'Tạo lịch sử mượn sách thành công',
                data: historyBook,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }


    // Xem lịch sử mượn sách User
    async getHistoryUser(req, res) {
        try {
            const { id } = req.user;
            const historyBook = await History.findAll({ where: { userId: id } }); 

            const data = await Promise.all(
                historyBook.map(async (item) => {
                    const product = await Product.findOne({ where: { id: item.bookId } }); 
                    return { ...item.dataValues, product };
                })
            );

            res.status(200).json({
                success: true,
                message: 'Lấy lịch sử mượn thành công',
                data,
            });
        } catch (error) {
            console.error('Lỗi server');
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    // Hủy mượn
    async cancelBook(req, res) {
        try {
            const { id } = req.user;
            const { idHistory } = req.body;
            const findHistory = await History.findOne({ where: { id: idHistory, userId: id } });
            if (!findHistory)
                return res.status(400).json({ success: false, message: 'Lịch sử mượn sách không tồn tại' });


            await History.update({ status: 'cancel' }, { where: { id: idHistory } }); 


            res.status(200).json({ success: true, message: 'Hủy mượn thành công' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    // Admin xem tất cả lịch sử
    async getAllHistoryBook(req, res) {
        try {
            const historyBook = await History.findAll({
                order: [['createdAt', 'DESC']],
            });

            const data = await Promise.all(
                historyBook.map(async (item) => {
                    const product = await Product.findOne({ where: { id: item.bookId } });
                    return { ...item.dataValues, product };
                })
            );

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách lịch sử mượn thành công',
                data,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Lỗi server' }); 
        }
    }

    // Trạng thái mượn sách

    async updateStatusBook(req, res) {
        try {
            const { idHistory, status, userId } = req.body;
            
            const findUser = await User.findOne({ where: {id: userId}});
            const findHistory = await History.findOne({ where: { id: idHistory } });
            if (!findHistory) {
                return res.status(400).json({ success: false, message: 'Lịch sử mượn không tồn tại' });
            }

            
            if (status === 'success') {
                const product = await Product.findOne({ where: { id: findHistory.bookId } });
                if (!product) {
                    return res.status(400).json({ success: false, message: 'Sách không tồn tại' });
                }

                if (product.stock < findHistory.quantity) {
                    return res.status(400).json({ success: false, message: 'Số lượng sách không đủ để duyệt' });
                }

                await Product.update(
                    { stock: product.stock - findHistory.quantity },
                    { where: { id: findHistory.bookId } }
                );
                await User.update(
                    { borrowed: findUser.borrowed + findHistory.quantity},
                    { where: { id: findUser.id  }}
                )
            }

            await History.update({ status }, { where: { id: idHistory } });

            res.status(200).json({ success: true, message: 'Cập nhật trạng thái mượn thành công'});
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi server' }); 
        }
    }

}

module.exports = new historyBookController();
