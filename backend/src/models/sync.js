const historyBook = require('./historyBook.model');
const User = require('./users.model');

const sync = async () => {
    await User.sync();
    await historyBook.sync();

}


module.exports = sync;