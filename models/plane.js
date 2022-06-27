const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Plane extends Model { }

Plane.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    modelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'plane_models', key: 'id' },
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
    modelName: 'plane',
})

module.exports = Plane
