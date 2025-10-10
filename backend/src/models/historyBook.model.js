const { DataTypes } = require('sequelize');
const { connect } = require('../config/connectDB');

const historyBook = connect.define(
    'historyBook',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bookId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        borrowDate: {
            type: DataTypes.DATE,
            allowNull: false,
        }, 
        returnDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending','success', 'cancel'),
            allowNull: false,
            defaultValue: 'pending'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        }
    },
    {
        freezeTableName: true,
    }
)

module.exports = historyBook;