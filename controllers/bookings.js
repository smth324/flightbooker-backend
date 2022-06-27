const router = require('express').Router()
const {
    Booking, Customer, Flight, Route, Plane, Place, PlaneModel,
} = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

router.get('/', tokenExtractor, userExtractor, async (req, res) => {
    const bookings = await Booking.findAll({
        include: {
            model: Customer,
        },
    })
    return res.json(bookings)
})

router.get('/:id', tokenExtractor, userExtractor, async (req, res) => {
    const booking = await Booking.findOne({
        attributes: { exclude: ['flightId'] },
        include: [{
            model: Customer,
        }, {
            model: Flight,
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
        }],
        where: {
            id: req.params.id,
        },
    })
    if (!booking) {
        return res.status(404).send('no')
    }
    return res.json(booking)
})

router.post('/', async (req, res) => {
    console.log(req.body)
    const { customers } = req.body

    if (!customers) {
        return res.status(400).json({ error: 'need atleast one customer' })
    }
    if (!req.body.booking) {
        return res.status(400).json({ error: 'need atleast booking' })
    }

    const toBuild = []
    customers.forEach((x) => {
        toBuild.push(Customer.build({ ...x, bookingId: 1 }))
    })
    await Promise.all(toBuild)

    const toValidate = []
    for (let i = 0; i < toBuild.length; i += 1) {
        toValidate.push(toBuild[i].validate())
    }
    await Promise.all(toValidate)

    const booking = await Booking.create({ ...req.body.booking })

    const toSave = []
    for (let i = 0; i < toBuild.length; i += 1) {
        toBuild[i].bookingId = booking.id
        toSave.push(toBuild[i].save())
    }
    await Promise.all(toSave)

    return res.status(201).json(booking)
})

module.exports = router
