const History = require('../models/historyBook.model');
const User = require('../models/users.model');
const Product = require('../models/product.module');

class historyBookController {
    // Tạo lịch sử mượn sách
    async createHistoryBook(req, res) {
        try {
            const { id } = req.user;
            const findUser = await User.findOne({ where: { id } });
            if(!findUser) return res.status(400).json({ success: false, messeage: 'Không tìm thấy người dùng '});
            if(!findUser.idStudent || findUser.idStudent === '0') return res.status(400).json({ success: false, messeage: 'Bạn cần có ID sinh viên'});

            const { fullName, phoneNumber, address, bookId, borrowDate, returnDate, quantity } = req.body;
            if (!fullName || !phoneNumber || !address || !bookId || !borrowDate || !returnDate || !quantity) {
                return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
            }
            const findBook = Product.findOne({ where: { id: bookId }});
            if(!findBook) return res.status(400).json({ success: false, messeage: 'Không tìm thấy sách '});

            if(findBook.stock < quantity ) return res.status(400).json({ success: false, message: 'Số lượng sách không đủ'});

            const historyBook = await History.create({
                fullName,
                phone: phoneNumber,
                address,
                bookId,
                borrowDate,
                returnDate,
                quantity,
                userId: id,
            });
            return res.status(200).json({
                success: true,
                message: "Tạo lịch sử mượn sách thành công",
                data: historyBook
            });
        }catch(err){
            console.error(err)
            res.status(500).json({success: false, message: 'Lỗi sever'});
        }
    }

    // Xem lịch sử mượn sách User
    async getHistoryUser(req, res) {
        try {
            const { id } = req.user;
            const historyBook = await modelHistoryBook.findAll({ where: { userId: id } });

            const data = await Promise.all(
                historyBook.map(async (item) => {
                    const product = await modelProduct.findOne({ where: { id: item.bookId } });
                    return { ...item.dataValues, product };
                }),
            );

            res.status(200).json({
                success: true,
                message: 'Lấy lịch sử mượn thành công',
                data,
            });
        } catch (error) {
            console.error('❌ Lỗi tại getHistoryUser:', error);
            res.status(500).json({ success: false, message: 'Lỗi server'});
        }
    }



}