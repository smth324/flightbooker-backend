const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class LayoutBox extends Model { }

LayoutBox.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    planeModelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'plane_models', key: 'id' },
    },
    nameId: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    placement: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'layoutBox',
})

module.exports = LayoutBox
