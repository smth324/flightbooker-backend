const Admin = require('./admin')
const Token = require('./token')
const Route = require('./route')
const Place = require('./place')
const LayoutBox = require('./layoutBoxes')
const PlaneModel = require('./planeModel')
const Plane = require('./plane')
const Flight = require('./flight')
const Booking = require('./booking')
const Customer = require('./customer')

Route.belongsTo(Place, { foreignKey: 'originId', as: 'origin' })
Route.belongsTo(Place, { foreignKey: 'destinationId', as: 'destination' })
PlaneModel.hasMany(LayoutBox)
LayoutBox.belongsTo(PlaneModel)
Plane.belongsTo(PlaneModel, { foreignKey: 'modelId', as: 'model' })
Flight.belongsTo(Plane)
Flight.belongsTo(Route)
Flight.hasMany(Booking)
Booking.belongsTo(Flight)
Customer.belongsTo(Booking)
Booking.hasMany(Customer)
Customer.belongsTo(LayoutBox, { foreignKey: 'seatId', as: 'seat' })

module.exports = {
    Admin, Token, Route, Place, Plane, PlaneModel, LayoutBox, Flight, Customer, Booking,
}
