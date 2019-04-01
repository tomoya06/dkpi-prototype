const tls = require('tls')
const fs = require('fs')
const path = require('path')

const option = {
    key: fs.readFileSync(path.resolve(__dirname, '../pems/server-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../pems/server-cert.pem')),
    requestCert: true,
    rejectUnauthorized: true,
    ca: [
        fs.readFileSync(path.resolve(__dirname, '../pems/client-cert.pem'))
    ]
}

// const clients = []

const server = tls.createServer(option)

server.on('secureConnection', function(tlsSocket) {
    console.log(`NEW CONNECTION, ${tlsSocket.authorized ? 'AUTHED': 'UNAUTHED'}`)

    // clients.push(tlsSocket)
    tlsSocket.on('close', function() {
        console.log('SOCKET CLOSED')
    })
})

server.listen(3333, function() {
    console.log(`TLS SERVER LISTENING ON 3333`)
})