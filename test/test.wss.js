const {
    serverWSS
} = require('../lib/WEBapi')

const path = require('path')

serverWSS(
    path.resolve(__dirname, '../pems', 'server-cert.pem'),
    path.resolve(__dirname, '../pems', 'server-key.pem'),
    8080
)
// serverWSS(
//     path.resolve(__dirname, '..', 'server.crt'),
//     path.resolve(__dirname, '..', 'key.pem'),
//     8080
// )
