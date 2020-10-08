const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const bodyParser = require('body-parser')
const user = require('./src/routes/user')
const db = require('./src/config/config')
const env = require('./src/helpers/env')
const cors = require('cors')
const userModel = require('./src/models/user')
const path = require('path')
const ejs = require('ejs')

db.connect((err) => {
    if (err) throw err
    console.log('Database connected');
})

app.use(express.static('src/img'))
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
io.on('connection', (socket) => {
    socket.on('send-message', (payload) => {
        userModel.insertChat(payload)
        userModel.getMessage(payload)
            .then((result) => {
                io.to(payload.recevier).emit('list-message', result)
                io.to(payload.sender).emit('list-message', result)
            }).catch((err) => {
                console.log(err);
            })
    })
    socket.on('getAll', (payload) => {
        // console.log(payload);
        userModel.getFriends(payload.id)
            .then((result) => {
                io.to(payload.sender).emit('userList', result)
            })
    })
    socket.on('getM', () => {
        // console.log(payload);
        userModel.getUser()
            .then((result) => {
                io.emit('profile', result)
            })
    })
    socket.on('get-message', (payload) => {
        userModel.getMessage(payload)
            .then((result) => {
                io.to(payload.sender).emit('list-message', result)
                // io.emit('chatting', (result))
            }).catch((err) => {
                console.log(err);
            })
    })
    socket.on('join-room', (payload) => {
        socket.join(payload.user)
    })
})
app.use('/user', user)

server.listen(env.PORT, () => {
    console.log(`Server running at port ${env.PORT}`);
})


