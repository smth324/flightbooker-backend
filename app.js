const express = require('express')
const path = require('path')
require('express-async-errors')

const app = express()
const cors = require('cors')

app.use(cors())
const adminsRouter = require('./controllers/admins')
const loginsRouter = require('./controllers/login')
const logoutsRouter = require('./controllers/logouts')
const routesRouter = require('./controllers/routes')
const placesRouter = require('./controllers/places')
const planeModelsRouter = require('./controllers/planeModels')
const planesRouter = require('./controllers/planes')
const flightsRouter = require('./controllers/flights')
const bookingsRouter = require('./controllers/bookings')
const customersRouter = require('./controllers/customers')
const promotionsRouter = require('./controllers/promotions')
const testingRouter = require('./controllers/testing')
const { errorHandler, unknownEndpoint } = require('./utils/middleware')

app.use(express.json())
app.use(express.static('build'))

app.use('/api/admins', adminsRouter)
app.use('/api/logins', loginsRouter)
app.use('/api/logouts', logoutsRouter)
app.use('/api/routes', routesRouter)
app.use('/api/places', placesRouter)
app.use('/api/planeModels', planeModelsRouter)
app.use('/api/planes', planesRouter)
app.use('/api/flights', flightsRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/customers', customersRouter)
app.use('/api/promotions', promotionsRouter)

if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter)
}

app.use('/*', (req, res) => {
    res.sendFile(path.resolve('./build/index.html'))
})

app.use(errorHandler)
app.use(unknownEndpoint)

module.exports = app
