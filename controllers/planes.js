const router = require('express').Router()
const { PlaneModel, Plane } = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

router.get('/', tokenExtractor, userExtractor, async (req, res) => {
    const planes = await Plane.findAll({
        attributes: { exclude: ['modelId'] },
        include: {
            model: PlaneModel,
            as: 'model',
        },
    })
    return res.json(planes)
})

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
    const plane = await Plane.create({ ...req.body })
    const planeToReturn = await Plane.findOne({
        where: plane.id,
        attributes: { exclude: ['modelId'] },
        include: {
            model: PlaneModel,
            as: 'model',
        },

    })
    return res.status(201).json(planeToReturn)
})

router.put('/activity/:id', tokenExtractor, userExtractor, async (req, res) => {
    const planes = await Plane.findByPk(req.params.id, {
        attributes: { exclude: ['modelId'] },
        include: {
            model: PlaneModel,
            as: 'model',
        },
    })
    if (!planes) {
        return res.status(404).send({ error: 'cannot find plane' })
    }
    planes.active = req.body.active
    await planes.save()
    return res.json(planes)
})

module.exports = router
