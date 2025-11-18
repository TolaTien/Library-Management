const historyBook = require('./historyBook.model');
const User = require('./users.model');
const Product = require('./product.model');

const sync = async () => {
    await User.sync();
    await historyBook.sync();
    await Product.sync();

}

module.exports = sync;
