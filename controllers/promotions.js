const router = require('express').Router()
const { Promotions } = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

router.get('/', tokenExtractor, userExtractor, async (req, res) => {
    const promotions = await Promotions.findAll({
        order: [
            ['id', 'ASC'],
        ],
    })
    if (!promotions) {
        return res.json('No promo')
    }
    return res.json(promotions)
})

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
    const promo = await Promotions.create({ ...req.body })
    return res.status(201).json(promo)
})

router.post('/check', async (req, res) => {
    const promo = await Promotions.findOne({
        attributes: { include: ['promotionPercent', 'code'] },
        where: {
            code: req.body.code,
        },
    })
    return res.json(promo)
})

router.put('/activity/:id', tokenExtractor, userExtractor, async (req, res) => {
    const promotions = await Promotions.findByPk(req.params.id)
    if (!promotions) {
        return res.status(404).send({ error: 'cannot find promo' })
    }
    promotions.active = req.body.active
    await promotions.save()
    return res.json(promotions)
})

module.exports = router
