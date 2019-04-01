const socketio = require('socket.io-client')
const socket = socketio('http://localhost', {
    query: 'foo=bar'
}).connect()

socket.on('message', function(data) {
    console.log(`RECEIVED: ${data}`)

    socket.send('good')
})
