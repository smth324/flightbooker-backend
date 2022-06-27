const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('./config')
const logger = require('./logger')

const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
})

const migrationConf = {
    migrations: {
        glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
}

const runMigrations = async () => {
    const migrator = new Umzug(migrationConf)
    const migrations = await migrator.up()
    logger.info('Migrations up to date', {
        files: migrations.map((mig) => mig.name),
    })
}
const rollbackMigration = async () => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConf)
    await migrator.down()
}

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await runMigrations()
        logger.info('connected to the database')
    } catch (err) {
        logger.error('failed to connect to the database')
        logger.error(err)
        return process.exit(1)
    }

    return null
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }
