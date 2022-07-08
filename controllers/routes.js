const router = require('express').Router()
const { Route, Place } = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

router.get('/', async (req, res) => {
    const routes = await Route.findAll({
        attributes: { exclude: ['originId', 'destinationId'] },
        order: [
            ['id', 'ASC'],
        ],
        include: [{
            model: Place,
            as: 'origin',
        },
        {
            model: Place,
            as: 'destination',
        }],
    })
    return res.json(routes)
})

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
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

router.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
    const route = await Route.findByPk(req.params.id)
    if (!route) {
        return res.status(404).send({ error: 'cannot find route' })
    }
    await route.destroy()
    return res.json(route)
})

router.put('/activity/:id', tokenExtractor, userExtractor, async (req, res) => {
    const route = await Route.findByPk(req.params.id, {
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
    if (!route) {
        return res.status(404).send({ error: 'cannot find route' })
    }
    route.active = req.body.active
    await route.save()
    return res.json(route)
})

module.exports = router
