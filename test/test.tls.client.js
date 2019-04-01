const tls = require('tls')
const fs = require('fs')
const path = require('path')

const option = {
    port: 3333,
    key: fs.readFileSync(path.resolve(__dirname, '../pems/client-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../pems/client-cert.pem')),
    ca: [
        fs.readFileSync(path.resolve(__dirname, '../pems/server-cert.pem'))
    ],
    checkServerIdentity: () => { return null },
}

const socket = tls.connect(option, function () {
    console.log(`CLIENT CONNECTED, ${socket.authorized ? 'AUTHED' : 'UNAUTHED'}`)
})
socket.setEncoding('utf8')
socket.on('data', (data) => {
    console.log(data)
})
socket.on('end', () => {
    console.log('server ends connection')
})
