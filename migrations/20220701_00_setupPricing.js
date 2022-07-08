const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('routes', 'price', {
            type: DataTypes.INTEGER,
            allowNull: false,
        })
        await queryInterface.addColumn('bookings', 'price', {
            type: DataTypes.INTEGER,
            allowNull: false,
        })
        await queryInterface.createTable('promotions', {
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
            number_of_redemptions: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            expiry_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            promotion_percent: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('routes', 'price')
        await queryInterface.removeColumn('bookings', 'price')
        await queryInterface.dropTable('promotions')
    },
}
