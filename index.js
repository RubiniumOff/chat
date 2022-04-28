const express = require('express')
const { get } = require('express/lib/response')
const http = require('http')
const mongoose = require('mongoose')
const { Server } = require('socket.io')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'chat';

const User = require('./schems/userschema')

app.use(express.static(__dirname + '/public'))
// app.use(session)
app.use(cookieParser('secreeeeet'))
app.use(express.urlencoded({extended: true}))

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


app.post('/loginme', async (req, res) => {
    let getData = await User.findOne({login: req.body.login})
    if (getData == '') res.status(403).send('Не верно указал логин')
    if (getData.password != req.body.password) res.status(403).send('Не верно указал пароль')
    res.cookie('id', getData._id)
    res.cookie('name', getData.name)
    res.cookie('lastname', getData.lastname)
    res.cookie('avatar', getData.avatar)
    res.redirect('/')
})

app.get('/', (req, res, next) => {
    if (!req.cookies.id) res.redirect('/login')
    else next()
}, (req, res, next) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/login', (req, res, next) => {
    res.sendFile(__dirname + '/login.html')
})

app.get('/chat', (req, res, next) => {
    if (!req.cookies.id) res.redirect('/login')
    else next()
}, (req, res, next) => {
    res.sendFile(__dirname + '/chat.html')
})

server.listen(3000, async () => {
    console.clear()
    // let user = new User({
    //     login: 'admin',
    //     password: 'qazwsx66613',
    //     name: 'Денис',
    //     lastname: 'Шляхтин',
    //     avatar: 'rubinium'
    // })
    // user.save()
    try {
        const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
        mongoose.connect(url, {useNewUrlParser: true});
        console.log('Модуль MongoDB подключен. База работает.');
    } catch {
        console.log('Подключение не было установлено!');
    }
    console.log('Сервер запущен и для работы использует порт 3000');
})