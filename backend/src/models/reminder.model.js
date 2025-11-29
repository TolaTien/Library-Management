const { connect } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const Reminder = connect.define(
        'reminders',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, 
                primaryKey: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.STRING(36),
                allowNull: false
            },
            historyId: {
                type: DataTypes.STRING(36),
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
        },
        {
           freezeTableName: true,
            timestamps: true,
        }
    );

module.exports = Reminder;