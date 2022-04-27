const express = require('express')
const { get } = require('express/lib/response')
const http = require('http')
const mongoose = require('mongoose')
const { Server } = require('socket.io')
const cookieParser = require('cookie-parser')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname + '/public'))
app.use(cookieParser())

io.on('connection', (socket) => {
    socket.on('chat_info', (data) => {
        socket.join('chat-' + data.room_id)
        console.log('Пользователь '+ data.sender +' определен в комнату chat-' + data.room_id);
    })
    socket.on('user write msg', (data) => {
        socket.to('chat-' + data.room_id).emit('incoming message', {'msg': data.msg});
        console.log('Пользователь отправил сообщение: '+ data.msg);
    })
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

server.listen(3000, () => {
    console.log('Server started and worked on port :*3000');
})