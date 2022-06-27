const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Customer extends Model { }

Customer.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.ENUM('Master', 'Miss', 'Mr', 'Ms', 'Mrs'),
        allowNull: false,
        validate: {
            isIn:
            {
                args: [['Master', 'Miss', 'Mr', 'Ms', 'Mrs']],
                msg: 'Must be proper Title',
            },
        },
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Child', 'Adult'),
        allowNull: false,
        validate: {
            isIn:
            {
                args: [['Child', 'Adult']],
                msg: 'Must be Child or Adult',
            },
        },
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'bookings', key: 'id' },
    },
    seatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'layout_boxes', key: 'id' },
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'customer',
})

module.exports = Customer
