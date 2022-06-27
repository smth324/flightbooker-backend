const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const { SECRET } = require('../utils/config')
const { Admin, Token } = require('../models')

router.post('/', async (request, response) => {
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
