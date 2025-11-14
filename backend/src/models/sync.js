const historyBook = require('./historyBook.model');
const User = require('./users.model');
const Product = require('./product.model');

const sync = async () => {
    await User.sync({ alter: true });       // ⭐ Tự động thêm cột cardStatus
    await historyBook.sync({ alter: true });
    await Product.sync({ alter: true });
}

module.exports = sync;
