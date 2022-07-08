const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('bookings', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            promotion_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            emergency_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            emergency_phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            flight_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'flights', key: 'id' },
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
        await queryInterface.createTable('customers', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.ENUM('Master', 'Miss', 'Mr', 'Ms', 'Mrs'),
                allowNull: false,
                validate: {
                    isIn:
                    {
                        args: [['Master', 'Miss', 'Mr', 'Ms', 'Mrs']],
                        msg: 'Must be proper Title',
                    },
                },
            },
            birthday: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('Child', 'Adult'),
                allowNull: false,
            },
            booking_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'bookings', key: 'id' },
            },
            seat_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'layout_boxes', key: 'id' },
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('customers', 'booking_id')
        await queryInterface.removeColumn('customers', 'seat_id')
        await queryInterface.removeColumn('bookings', 'flight_id')
        await queryInterface.dropTable('customers')
        await queryInterface.dropTable('bookings')
    },
}
