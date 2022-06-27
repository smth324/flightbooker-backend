const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('tokens', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('tokens')
    },
}
