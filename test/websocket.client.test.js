const socketio = require('socket.io-client')

socket = socketio.connect('http://localhost:80', {
    query: {
        what: {
            a: 'a',
            b: 'b'
        }
    }
})
socket.on('connect', () => {
    console.log('CONNECT')
    socket.send('good')
})
// .on('challenge', (data) => {
//     console.log('CHALLENGE', data)
//     socket.emit('response', 'test')
// })