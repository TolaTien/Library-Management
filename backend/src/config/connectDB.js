const { Sequelize } = require("sequelize");

<<<<<<< HEAD
const connect = new Sequelize(
    'mydb',
    'root',
    '03062006',
    {
        host: 'localhost',
        dialect: 'mysql',
        port: '3306',
    }
);
=======
const connect = new Sequelize("lb", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
  port: "3306",
});
>>>>>>> a789c817e0eabbf3563d3d31502266cff92dd460

const connectDB = async () => {
  try {
    await connect.authenticate();
    console.log("✅ Connect Database Success!");
  } catch (err) {
    console.error("❌ Error connect database: ", err);
  }
};
module.exports = { connectDB, connect };
