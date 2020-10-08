const mysql = require('mysql2')
const env = require('../helpers/env')

const db = mysql.createConnection({
    host: env.host,
    user: env.user,
    password: '',
    database: env.db
})

module.exports = db