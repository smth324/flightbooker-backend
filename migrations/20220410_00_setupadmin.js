/* eslint-disable no-useless-escape */
const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('admins', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                },
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password_hash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            disabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('admins')
    },
}
