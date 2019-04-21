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
            console.log('ATTEMPT TO CONNECT')
            // TODO: CHECK FROM BLOCKCHAIN IF PUBKEY & ADDR ARE LEGIT
            socket.herPublickey = revertPubkeyFromPEM(query.pubkey)
            socket.challenge = Math.floor(Math.random() * 99999).toString()
            socket.isChallenged = false
            return next()
        })

        socketio.on('connection', (socket) => {
            console.log('CONNECTED, ATTEMPT TO AUTH')
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
                } else if (socket.isChallenged) {
                    console.log('RECEIVED ENCRYPTED DATA: ', packet[1])
                    if (packet[1]) {
                        packet[1] = decryptData(packet[1], {
                            myPrivateKey: this.myKeypair.privateKey,
                            herPublickey: socket.herPublickey
                        })
                    }
                    return next()
                } else if (packet[0] === 'CHALLENGE_RESPONSE') {
                    if (packet[1] === socket.challenge) {
                        socket.emit('CHALLENGE_SUCCESS')
                        console.log('CHALLENGE PASSED')
                        enSend('HELLO')
                        socket.isChallenged = true
                        return next()
                    } else {
                        console.log('CHALLENGE FAILED')
                        return next(new Error('WRONG RESPONSE'))
                    }
                } else if (packet[0] !== 'CHALLENGE_RESPONSE' && !socket.isChallenged) {
                    return next(new Error('NOT RESPONSE TO CHALLENGE'))
                } else {
                    return next(new Error('SOCKET ERROR'))
                }

            })
            console.log('NEW CONNECTION')
            socket.emit('CHALLENGE', socket.herPublickey.encrypt(socket.challenge))

            socket.on('CHALLENGE', (data) => {
                console.log('RECEIVE CHALLENGE FROM CLIENT...')
                socket.emit('CHALLENGE_RESPONSE', this.myKeypair.privateKey.decrypt(data))
            }).on('CHALLENGE_SUCCESS', () => {
                console.log('CHALLENGE SUCCESS')
            }).on('COMMUNICATION', (data) => {
                console.log('MESSAGE: ', data)
                socket.emit('RECEIVED')
            })
        })
    }
}
