const router = require('express').Router()
const { Op } = require('sequelize')
const { isBefore } = require('date-fns')
const {
    Booking, Customer, Flight, Route, Plane, Place, PlaneModel, Promotions, LayoutBox,
} = require('../models')
const { calculateBookingPayment, calculateFlightPayment } = require('../utils/calculatePayment')
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

    // validated all customers before proceeding
    const toValidate = []
    for (let i = 0; i < toBuild.length; i += 1) {
        toValidate.push(toBuild[i].validate())
    }
    await Promise.all(toValidate)

    // finds the flight selected
    const flight = await Flight.findByPk(req.body.booking.flightId, {
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
            model: Booking,
            include: {
                model: Customer,
                include: {
                    model: LayoutBox,
                    as: 'seat',
                },
            },
        }, {
            model: Plane,
            attributes: { exclude: ['modelId'] },
            include: {
                model: PlaneModel,
                as: 'model',
            },
        }],
    })

    // checks whether flight is in the past
    if (isBefore(new Date(flight.departureDate), new Date())) {
        return res.status(400).json({ error: 'flight is in the past' })
    }

    // checks whether selected seats are taken
    const takenSeats = []
    const seats = customers.map((x) => x.seatId)
    for (let i = 0; i < flight.bookings.length; i += 1) {
        for (let i2 = 0; i2 < flight.bookings[i].customers.length; i2 += 1) {
            takenSeats.push(flight.bookings[i].customers[i2].seatId)
        }
    }
    if (!seats.some((x) => !takenSeats.includes(x))) {
        return res.status(400).json({ error: 'seat already taken' })
    }

    // checks that customer seat matches selected cabin class
    const seatCheck = customers.map((x) => LayoutBox.findByPk(x.seatId))
    const waitedSeatCheck = await Promise.all(seatCheck)
    let typeOfSeat = 'seat'
    switch (req.body.formData.cabinClass) {
    case 'Economy':
        typeOfSeat = 'seat'
        break
    case 'Premium Economy':
        typeOfSeat = 'premiumSeat'
        break
    case 'Business':
        typeOfSeat = 'businessSeat'
        break
    default:
        typeOfSeat = 'seat'
        break
    }
    if (!waitedSeatCheck.every((x) => x.type === typeOfSeat)) {
        return res.status(400).json({ error: 'seats do not match cabin class' })
    }

    // looks for promo and checks if valid
    const promo = await Promotions.findOne({
        where: {
            code: req.body.booking.promotionCode,
            expiryDate: {
                [Op.gte]: new Date(),
            },
            numberOfRedemptions: {
                [Op.gt]: 0,
            },
            active: true,
        },
    })
    const flightPrice = calculateFlightPayment([flight], req.body.formData.cabinClass)
    const price = calculateBookingPayment(
        flightPrice[0].price,
        req.body.customers.length,
        promo?.promotionPercent || 0,
    )
    const booking = await Booking.create({ ...req.body.booking, price })

    const toSave = []
    for (let i = 0; i < toBuild.length; i += 1) {
        toBuild[i].bookingId = booking.id
        toSave.push(toBuild[i].save())
    }
    await Promise.all(toSave)
    if (promo) {
        promo.numberOfRedemptions -= 1
        await promo.save()
    }
    return res.status(201).json(booking)
})

module.exports = router
