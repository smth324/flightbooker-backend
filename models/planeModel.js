const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class PlaneModel extends Model { }

PlaneModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passengerCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cargoCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'planeModel',
})

module.exports = PlaneModel
