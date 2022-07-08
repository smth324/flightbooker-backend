const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Booking extends Model { }

Booking.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    promotionCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emergencyName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emergencyPhone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'flights', key: 'id' },
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'booking',
})

module.exports = Booking
