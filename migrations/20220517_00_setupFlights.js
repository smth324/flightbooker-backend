const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('flights', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            route_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'routes', key: 'id' },
            },
            plane_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'planes', key: 'id' },
            },
            departure_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            arrival_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('flights', 'plane_id')
        await queryInterface.removeColumn('flights', 'route_id')
        await queryInterface.dropTable('flights')
    },
}
