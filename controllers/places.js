const router = require('express').Router()
const { Place } = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

router.get('/', tokenExtractor, userExtractor, async (req, res) => {
    const places = await Place.findAll({
        order: [
            ['id', 'ASC'],
        ],
    })
    if (!places) {
        return res.json('No Places')
    }
    return res.json(places)
})

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
    const place = await Place.create({ ...req.body })
    return res.status(201).json(place)
})

router.put('/activity/:id', tokenExtractor, userExtractor, async (req, res) => {
    const place = await Place.findByPk(req.params.id)
    if (!place) {
        return res.status(404).send({ error: 'cannot find place' })
    }
    place.active = req.body.active
    await place.save()
    return res.json(place)
})

module.exports = router
