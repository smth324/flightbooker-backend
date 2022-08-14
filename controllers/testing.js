/* eslint-disable no-unused-vars */
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const { SECRET } = require('../utils/config')
const {
    Flight, Place, Plane, PlaneModel, Route, Admin, Token, LayoutBox, Promotions, Booking,
} = require('../models')

router.post('/reset', async (req, res) => {
    await Admin.truncate({ cascade: true, restartIdentity: true })
    await Token.truncate({ cascade: true, restartIdentity: true })
    await LayoutBox.truncate({ cascade: true, restartIdentity: true })
    await Promotions.truncate({ cascade: true, restartIdentity: true })
    await Booking.truncate({ cascade: true, restartIdentity: true })
    await Place.truncate({ cascade: true, restartIdentity: true })
    await Plane.truncate({ cascade: true, restartIdentity: true })
    await Route.truncate({ cascade: true, restartIdentity: true })
    await PlaneModel.truncate({ cascade: true, restartIdentity: true })
    await Flight.truncate({ cascade: true, restartIdentity: true })
    res.status(204).end()
})

router.post('/admins', async (req, res) => {
    const passwordHash = await bcryptjs.hash(req.body.password, 10)
    const admin = await Admin.create({
        username: req.body.username,
        email: req.body.email,
        passwordHash,
    })
    return res.json({
        id: admin.id,
        username: admin.username,
        email: admin.email,
    })
})
router.post('/routes', async (req, res) => {
    const route = await Route.create({ ...req.body })
    const routeToReturn = await Route.findOne({
        where: route.id,
        attributes: { exclude: ['originId', 'destinationId'] },
        include: [{
            model: Place,
            as: 'origin',
        },
        {
            model: Place,
            as: 'destination',
        }],
    })
    return res.status(201).json(routeToReturn)
})
router.post('/places', async (req, res) => {
    const place = await Place.create({ ...req.body })
    return res.status(201).json(place)
})

router.post('/login', async (request, response) => {
    const { body } = request
    if (!body.username) {
        return response.status(401).json({
            error: 'invalid username or passwords',
        })
    }
    const admin = await Admin.findOne({
        where: {
            username: body.username,
        },
    })

    const passwordCorrect = admin === null
        ? false
        : await bcryptjs.compare(body.password, admin.passwordHash)

    if (!(admin && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password',
        })
    }

    const userForToken = {
        username: admin.username,
        id: admin.id,
    }

    const token = jwt.sign(userForToken, SECRET)
    await Token.create({ token })
    return response
        .status(200)
        .send({
            token, username: admin.username, email: admin.email,
        })
})

module.exports = router
