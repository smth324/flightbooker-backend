require('dotenv').config()
const { rollbackMigration } = require('./db')

rollbackMigration()
