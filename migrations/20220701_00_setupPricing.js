const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('routes', 'price', {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('routes', 'price')
    },
}
