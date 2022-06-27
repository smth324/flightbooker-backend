const { DataTypes } = require('sequelize')

// add cargo and pasnger cpacity refractor controller model and frontend accordingly
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('plane_models', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            passenger_capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            cargo_capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
        await queryInterface.createTable('layout_boxes', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            plane_model_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'plane_models', key: 'id' },
            },
            name_id: {
                type: DataTypes.STRING,
                defaultValue: null,
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
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
        })
        await queryInterface.createTable('planes', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            model_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'plane_models', key: 'id' },
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
        await queryInterface.removeColumn('layout_boxes', 'plane_model_id')
        await queryInterface.removeColumn('planes', 'model_id')
        await queryInterface.dropTable('layout_boxes')
        await queryInterface.dropTable('plane_models')
        await queryInterface.dropTable('planes')
    },
}
