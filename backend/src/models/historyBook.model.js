const { DataTypes } = require('sequelize');
const { connect } = require('../config/connectDB');

const historyBook = connect.define(
    'historyBooks',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
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
            type: DataTypes.UUID,
            allowNull: false,
        },
        borrowDate: {
            type: DataTypes.DATE,
            allowNull: false,
        }, 
        returnDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending','success', 'cancel','returned'),
            allowNull: false,
            defaultValue: 'pending'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        fine: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        }
    },
    {
        freezeTableName: true,
        timestamps: true
    }
)

module.exports = historyBook;