const { Sequelize } = require("sequelize");

const connect = new Sequelize("library_management", "root", "17032006", {
  host: "localhost",
  dialect: "mysql",
  port: "3306",
});

const connectDB = async () => {
  try {
    await connect.authenticate();
    console.log("✅ Connect Database Success!");
  } catch (err) {
    console.error("❌ Error connect database: ", err);
  }
};
module.exports = { connectDB, connect };
