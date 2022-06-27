const router = require('express').Router()
const { PlaneModel, LayoutBox } = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

router.get('/', tokenExtractor, userExtractor, async (req, res) => {
    const planeModels = await PlaneModel.findAll({})
    if (!planeModels) {
        return res.status(404).send('npo')
    }
    return res.json(planeModels)
})

router.get('/:id', tokenExtractor, userExtractor, async (req, res) => {
    const planeModel = await PlaneModel.findOne({
        include: {
            model: LayoutBox,
        },
        where: {
            id: req.params.id,
        },
    })
    if (!planeModel) {
        return res.status(404).send('npo')
    }
    return res.json(planeModel)
})

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
    const planeModel = req.body
    if (!planeModel.name) {
        return res.status(400).json({ error: 'invalid format need to have name' })
    }
    if (!planeModel.floors) {
        return res.status(400).json({ error: 'invalid format need to have floors' })
    }
    const planeModelCheck = await PlaneModel.findOne({
        where: {
            name: planeModel.name,
        },
    })
    if (planeModelCheck) {
        return res.status(400).json({ error: 'Plane Model name already exists' })
    }

    const newModel = await PlaneModel.create({
        name: planeModel.name,
        passengerCapacity: planeModel.passengerCapacity,
        cargoCapacity: planeModel.cargoCapacity,
    })
    const floorResults = []
    for (let i = 0; i < planeModel.floors.length; i += 1) {
        const result = []
        for (let x = 0; x < planeModel.floors[i].length; x += 1) {
            result.push(LayoutBox.create({
                ...planeModel.floors[i][x],
                planeModelId: newModel.id,
                floor: i,
            }))
        }
        floorResults.push(Promise.all(result))
    }
    await Promise.all(floorResults)

    const returnedModel = await PlaneModel.findByPk(newModel.id, {
        include: {
            model: LayoutBox,
        },
    })
    return res.status(201).json(returnedModel)
})

router.put('/activity/:id', tokenExtractor, userExtractor, async (req, res) => {
    const planeModel = await PlaneModel.findByPk(req.params.id)
    if (!planeModel) {
        return res.status(404).send({ error: 'cannot find plane model' })
    }
    planeModel.active = req.body.active
    await planeModel.save()
    return res.json(planeModel)
})

module.exports = router
