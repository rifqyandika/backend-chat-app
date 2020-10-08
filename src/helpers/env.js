require('dotenv').config()

const env = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.PASS,
    db: process.env.DB,
    PORT: process.env.PORT,
    USERMAIL: process.env.USEREMAIL,
    USERPASS: process.env.USERPASS,
    HOSTURL: process.env.HOSTURL,
    SECRETKEY: process.env.SECRET
}

module.exports = env