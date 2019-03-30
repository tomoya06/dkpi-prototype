const fs = require('fs')
const https = require('https')
const WebSocket = require('ws')

function serverWSS(path2CertPem, path2PriKeyPem, serverPort) {
    const server = https.createServer({
        cert: fs.readFileSync(path2CertPem),
        key: fs.readFileSync(path2PriKeyPem)
    })
    const wss = new WebSocket.Server({ server })
    wss.on('connection', function(ws) {
        console.log('NEW CONNECTION')
        ws.send('CONNECTED')
        
        ws.on('message', function (msg) {
            console.log(`RECEIVED: ${msg}`)
        })
    })
    
    server.listen(serverPort)
}

function clientWSS(path2CertPem, path2PriKeyPem, url) {
    const ws = new WebSocket(url)
    ws.on('message', function(msg) {
        console.log(`CLIENT RECEIVED: ${msg}`)
    })
}

module.exports = {
    serverWSS,
    clientWSS    
}
