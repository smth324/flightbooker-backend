const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Flight extends Model {
    async number_of_vacant() {
        const bookings = await this.getBookings()
        const customers = []
        for (let i = 0; i < bookings.length; i += 1) {
            customers.push(bookings[i].getCustomers())
        }
        const results = await Promise.all(customers)
        return await this.plane.model.passengerCapacity - results.flat().length
    }
}

Flight.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    routeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'routes', key: 'id' },
    },
    planeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'planes', key: 'id' },
    },
    departureDate: {
        type: DataTypes.DATE,
        primaryKey: true,
    },
    arrivalDate: {
        type: DataTypes.DATE,
        primaryKey: true,
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'flight',
})

module.exports = Flight
