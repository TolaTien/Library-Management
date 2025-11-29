const historyBook = require('./historyBook.model');
const User = require('./users.model');
const Product = require('./product.model');
const Reminder = require('./reminder.model')

const sync = async () => {
    await User.sync();
    await historyBook.sync();
    await Product.sync();
    await Reminder.sync();

}

module.exports = sync;
