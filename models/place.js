const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Place extends Model { }

Place.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            checkFormat(value) {
                if (!value.match('[a-zA-Z]+ \\([A-Z]{3}\\)\\s-\\s[a-zA-Z]+')) {
                    throw new Error('Name must be in format City (CTY) - Country')
                }
            },
        },
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
    modelName: 'place',
})

module.exports = Place
