const { Sequelize } = require("sequelize");


const connect = new Sequelize(
<<<<<<< HEAD
    'demo',
    'root',
    'dqhuy132006',
=======
    'web',
    'root',
    '123456789',
>>>>>>> 4fbd84f2dae40cb32d80bc3c0b22a8b8b10875d6
    {
        host: 'localhost',
        dialect: 'mysql',
        port: '3306',
    }
);

const connectDB = async () => {
  try {
    await connect.authenticate();
    console.log("✅ Connect Database Success!");
  } catch (err) {
    console.error("❌ Error connect database: ", err);
  }
};
module.exports = { connectDB, connect };
