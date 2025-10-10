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
            allowNull: false,

        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
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
    },
    {
        freezeTableName: true,
        timestamps: true,
    }
);

module.exports = User;