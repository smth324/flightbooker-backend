const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const { Admin } = require('../models')

router.get('/', async (req, res) => {
    const admins = await Admin.findAll({
        attributes: { exclude: ['password_hash'] },
    })
    if (!admins) {
        return res.json('No Admins')
    }
    return res.json(admins)
})

router.post('/', async (req, res) => {
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
        updatedAt: admin.updatedAt,
        createdAt: admin.createdAt,
    })
})

module.exports = router
