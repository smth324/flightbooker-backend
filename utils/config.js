require('dotenv').config()

const { PORT } = process.env
const { DATABASE_URL } = process.env
const { SECRET } = process.env

module.exports = {
    DATABASE_URL,
    PORT,
    SECRET,
}
