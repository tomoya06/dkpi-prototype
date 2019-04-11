const app = require('express')()
const httpServer = require('http').Server(app)
const socketio = require('socket.io')(httpServer)

httpServer.listen(80)
socketio.use((socket, next) => {
    console.log('USE')
    socket.test = 'test'
    // socket.emit('challenge', '100')
    // socket.on('response', (data) => {
    //     console.log('RESPONSE')
    //     if (data == socket.test) {
    //         next()
    //     } else {
    //         next(new Error('wrong challenge response'))
    //     }
    // })
    next()
})

socketio.on('connection', (socket) => {
    console.log('CONNECTION')
    console.log('SOCKET.TEST = ', socket.test)
    socket.use((packet, next) => {
        packet[1] = 'ALL THE SAME'
        next()
    })

    socket.on('message', (data) => {
        console.log('MESSAGE')
        console.log(data)
    })
})