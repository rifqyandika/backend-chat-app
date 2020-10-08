const express = require('express')
const route = express.Router()
const upload = require ('../helpers/upload')
const { register, login, verify, getUser, updateUser, addFriends, getFriends } = require('../controller/user')

route.post('/register', register)
route.post('/login', login)
route.get('/verification/:token', verify)
route.get('/detail/:id', getUser)
route.patch('/edit/:id',upload.single("image"), updateUser)
route.post('/addFriends', addFriends)
route.get('/friends/:id', getFriends)

module.exports = route