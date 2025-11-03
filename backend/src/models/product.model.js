
const { DataTypes } = require('sequelize');
const { connect } = require('../config/connectDB');

const product = connect.define('products', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nameProduct: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    covertType: {
        // Loại bìa
        type: DataTypes.ENUM('hard', 'soft'),
        allowNull: false,
    },
    publishYear: {
        // Năm xuất bản
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pages: {
        // Số trang
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    language: {
        // Ngôn ngữ
        type: DataTypes.STRING,
        allowNull: false,
    },
    publisher: {
        // Nhà xuất bản
        type: DataTypes.STRING,
        allowNull: false,
    },
    publishingCompany: {
        // Công ty phát hành
        type: DataTypes.STRING,
        allowNull: false,
    },

});

module.exports = product;
