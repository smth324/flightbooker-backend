/* eslint-disable no-useless-escape */
const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('places', {
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
                unique: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
        await queryInterface.createTable('routes', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            origin_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'places', key: 'id' },
            },
            destination_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'places', key: 'id' },
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('routes', 'origin_id')
        await queryInterface.removeColumn('routes', 'destination_id')
        await queryInterface.dropTable('places')
        await queryInterface.dropTable('routes')
    },
}
