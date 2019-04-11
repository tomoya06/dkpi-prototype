const app = require('express')()
const httpServer = require('http').Server(app)
const socketio = require('socket.io')(httpServer)

const {
    generateCipher,
    revertPubkeyFromPEM,
    generatePEM
} = require('./CERTapi')

const {
    encryptSend,
    decryptData
} = require('./util')

module.exports = class DServer {
    constructor(dpki, myKeypair, port = 80) {
        this.dpki = dpki
        this.myKeypair = myKeypair
        httpServer.listen(port)
        console.log('SERVER LISTENING ON PORT ' + port)
    
        socketio.use(async (socket, next) => {
            const { query } = socket.handshake
            if (!query.pubkey || !query.addr) {
                return next(new Error('CONNECTION QUERY FAILED'))
            }
            // TODO: CHECK FROM BLOCKCHAIN IF PUBKEY & ADDR ARE LEGIT
            socket.herPublickey = revertPubkeyFromPEM(query.pubkey)
            socket.challenge = Math.floor(Math.random()*99999).toString()
            socket.isChallenged = false
            return next()
        })
        
        socketio.on('connection', (socket) => {
            socket.emit('AUTH', {
                pubkey: generatePEM(this.myKeypair).pub,
                addr: this.dpki.ethConfig.user.address
            })
            const enSend = (data, evt) => {
                encryptSend(socket, data, {
                    cipher: generateCipher(),
                    herPublickey: socket.herPublickey,
                    myPrivateKey: this.myKeypair.privateKey
                }, evt)
            }

            socket.use((packet, next) => {
                if (packet[0] === 'CHALLENGE') {
                    return next()
                }
                if (socket.isChallenged) {
                    packet[1] = decryptData(packet[1], {
                        myPrivateKey: this.myKeypair.privateKey,
                        herPublickey: socket.herPublickey
                    })
                    return next()
                }
                if (packet[0] === 'CHALLENGE_RESPONSE') {
                    if (packet[1] === socket.challenge) {
                        console.log('CHALLENGE PASSED')
                        socket.isChallenged = true
                        return next()
                    } else {
                        console.log('CHALLENGE FAILED')
                        return next(new Error('WRONG RESPONSE'))
                    }
                }
                if (packet[0] !== 'CHALLENGE_RESPONSE' && !socket.isChallenged) {
                    return next(new Error('NOT RESPONSE TO CHALLENGE'))
                }
            })
            console.log('NEW CONNECTION')
            socket.emit('CHALLENGE', socket.herPublickey.encrypt(socket.challenge))

            enSend('HELLO')
            
            socket.on('CHALLENGE', (data) => {
                socket.send(this.myKeypair.publicKey.decrypt(data))
            }).on('message', (data) => {
                console.log('MESSAGE: ', data)
            })
        })
    }
}
