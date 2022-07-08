const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Promotions extends Model {}

Promotions.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    numberOfRedemptions: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    promotionPercent: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'promotions',
})

module.exports = Promotions
