const router = require('express').Router()
const { Customer } = require('../models')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

router.get('/', tokenExtractor, userExtractor, async (req, res) => {
    const customers = await Customer.findAll({})
    if (!customers) {
        return res.json('No customers')
    }
    return res.json(customers)
})

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
    const customer = await Customer.create({ ...req.body })
    return res.status(201).json(customer)
})

router.put('/activity/:id', tokenExtractor, userExtractor, async (req, res) => {
    const customer = await Customer.findByPk(req.params.id)
    if (!customer) {
        return res.status(404).send({ error: 'cannot find customer' })
    }
    customer.active = req.body.active
    await customer.save()
    return res.json(customer)
})

module.exports = router
