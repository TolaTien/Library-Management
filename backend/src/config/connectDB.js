const { Sequelize } = require("sequelize");

const connect = new Sequelize("lb", "root", "123456789", {
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
