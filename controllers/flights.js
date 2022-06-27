const router = require('express').Router()
const { Op } = require('sequelize')
const {
    Flight, Route, Plane, PlaneModel, Place, LayoutBox, Booking, Customer,
} = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

router.get('/', tokenExtractor, userExtractor, async (req, res) => {
    const flights = await Flight.findAll({
        attributes: { exclude: ['routeId', 'planeId'] },
        include: [{
            model: Route,
            attributes: { exclude: ['originId', 'destinationId'] },
            include: [{
                model: Place,
                as: 'origin',
            },
            {
                model: Place,
                as: 'destination',
            }],
        }, {
            model: Plane,
            attributes: { exclude: ['modelId'] },
            include: {
                model: PlaneModel,
                as: 'model',
            },
        }],
    })
    return res.json(flights)
})

router.get('/search', async (req, res) => {
    if (!req.query.origin
        || !req.query.destination
        || !req.query.departureDate
        || !req.query.cabinClass
        || !req.query.child
        || !req.query.adult) {
        return res.status(400).send({ error: 'Incomplete query' })
    }
    if (Number(req.query.adult) < Number(req.query.child)) {
        return res.status(400).send({ error: 'Adults should be greater than or equal to the number of kids' })
    }

    const after = new Date(new Date().setDate(new Date(req.query.departureDate).getDate() + 20))
    const before = new Date(new Date().setDate(new Date(req.query.departureDate).getDate() - 20))

    const flights = await Flight.findAll({
        attributes: { exclude: ['routeId', 'planeId', 'updatedAt', 'createdAt'] },
        where: {
            departureDate: {
                [Op.between]: [before, after],
            },
        },
        include: [{
            model: Route,
            required: true,
            attributes: { exclude: ['originId', 'destinationId', 'updatedAt', 'createdAt'] },
            include: [{
                model: Place,
                as: 'origin',
                attributes: { exclude: ['updatedAt', 'createdAt'] },
                where: {
                    name: req.query.origin,
                },
            },
            {
                model: Place,
                as: 'destination',
                attributes: { exclude: ['updatedAt', 'createdAt'] },
                where: {
                    name: req.query.destination,
                },
            }],
        },
        {
            model: Plane,
            attributes: { exclude: ['modelId'] },
            include: {
                model: PlaneModel,
                as: 'model',
            },
        }],
    })
    const numOfVacant = flights.map((x) => x.number_of_vacant())
    const numOfVacantWaited = await Promise.all(numOfVacant)
    const filter = numOfVacantWaited.map((x) => (
        x >= Number(req.query.adult) + Number(req.query.child)
    ))
    const fitleredFlights = flights.filter((x, i) => filter[i])
    return res.json(fitleredFlights)
})

router.get('/layout/:id', async (req, res) => {
    const flight = await Flight.findOne({
        include: [{
            model: Plane,
            attributes: { exclude: ['modelId'] },
            include: {
                model: PlaneModel,
                as: 'model',
                include: {
                    model: LayoutBox,
                },
            },
        }, {
            model: Booking,
            include: {
                model: Customer,
            },
        }],
        where: {
            id: req.params.id,
        },
    })
    if (!flight) {
        return res.status(404).send('npo')
    }
    // const layout = flight.plane.model.layoutBoxes
    const occupiedSeats = []
    flight.bookings.forEach((booking) => {
        booking.customers.forEach((customer) => {
            occupiedSeats.push(customer.seatId)
        })
    })
    const layout = flight.plane.model.layoutBoxes
    const filteredLayout = layout.map((x) => (occupiedSeats.includes(x.id) ? { ...x.dataValues, type: 'occupied' } : x))
    return res.json(filteredLayout)
})

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
    const flight = await Flight.create({ ...req.body })
    const planeToReturn = await Flight.findOne({
        where: flight.id,
        attributes: { exclude: ['routeId', 'planeId'] },
        include: [{
            model: Route,
            attributes: { exclude: ['originId', 'destinationId'] },
            include: [{
                model: Place,
                as: 'origin',
            },
            {
                model: Place,
                as: 'destination',
            }],
        }, {
            model: Plane,
            attributes: { exclude: ['modelId'] },
            include: {
                model: PlaneModel,
                as: 'model',
            },
        }],
    })
    return res.status(201).json(planeToReturn)
})

module.exports = router
