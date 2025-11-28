const { Sequelize } = require("sequelize");


const connect = new Sequelize(
<<<<<<< HEAD
    'demo',
=======
    'library',
>>>>>>> 0fbe177a07428abaf62f2690336d6389e6121a04
    'root',
    'dqhuy132006',
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
