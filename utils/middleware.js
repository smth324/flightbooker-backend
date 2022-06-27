const jwt = require('jsonwebtoken')
const { Token, Admin } = require('../models')
const { SECRET } = require('./config')

const errorHandler = (error, req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(error.message, error.name)
    console.log('asdjhdjkghsdkghldkjhgderrror')
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message })
    }
    if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).json({ error: error.message })
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: error.errors[0].message })
    }
    return next(error)
}

const tokenExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = await Token.findOne({
            where: {
                token: authorization.substring(7),
            },
        })
        if (!token) {
            return response.status(401).json({ error: 'token invalid login again' })
        }
        request.token = token
        return next()
    }
    return response.status(401).json({ error: 'no token login again' })
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token.token, SECRET)
    request.user = await Admin.findByPk(decodedToken.id)
    return next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    errorHandler, tokenExtractor, unknownEndpoint, userExtractor,
}
