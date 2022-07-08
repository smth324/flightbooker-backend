const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Route extends Model { }

Route.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    originId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'places', key: 'id' },
    },
    destinationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'places', key: 'id' },
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    modelName: 'route',
})

module.exports = Route
