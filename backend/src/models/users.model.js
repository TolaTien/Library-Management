const { connect } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const User = connect.define(
    'users',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
        },
        idStudent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cardStatus: {
            type: DataTypes.ENUM('not_requested', 'pending', 'active', 'cancelled'),
            defaultValue: 'not_requested',
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    }
);

module.exports = User;
