const {
    serverWSS
} = require('../lib/WEBapi')

const path = require('path')

// serverWSS(
//     path.resolve(__dirname, '../pems', 'test.cert.A.pem'),
//     path.resolve(__dirname, '../pems', 'test.pkey.A.pem'),
//     8080
// )
serverWSS(
    path.resolve(__dirname, '..', 'server.crt'),
    path.resolve(__dirname, '..', 'key.pem'),
    8080
)
