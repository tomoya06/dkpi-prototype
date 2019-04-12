const socketio = require('socket.io-client')

const {
    encryptSend,
    decryptData
} = require('./util')

const {
    generatePEM,
    revertPubkeyFromPEM
} = require('./CERTapi')

module.exports = class DClient {
    constructor(dpki, myKeypair, url = 'http://localhost:80') {
        this.dpki = dpki
        this.myKeypair = myKeypair

        this.socket = socketio.connect(url, {
            query: {
                pubkey: generatePEM(this.myKeypair).pub,
                addr: this.dpki.ethConfig.user.address
            }
        })
        const enSend = (data, evt) => {
            encryptSend(this.socket, data, {
                cipher: initCipher(),
                herPublickey: '',
                myPrivateKey: this.myKeypair.privateKey
            }, evt)
        } 
        this.socket.on('connect', () => {
            console.log('CONNECTED')
        }).on('AUTH', (query) => {
            if (!query.pubkey || !query.addr) {
                return next(new Error('CONNECTION QUERY FAILED'))
            }
            this.socket.herPublickey = revertPubkeyFromPEM(query.pubkey)
            this.socket.challenge = Math.floor(Math.random()*99999).toString()
            this.socket.isChallenged = false
            this.socket.emit('CHALLENGE', this.socket.herPublickey.encrypt(this.socket.challenge))
        }).on('CHALLENGE_RESPONSE', (data) => {
            if (data === this.socket.challenge) {
                console.log('CHALLENGE PASSED')
                this.socket.emit('CHALLENGE_SUCCESS')
                this.socket.isChallenged = true
            } else {
                this.socket.close()
            }
        }).on('CHALLENGE', (data) => {
            console.log('RECEIVED CHALLENGE FROM SERVER...')
            this.socket.emit('CHALLENGE_RESPONSE', this.myKeypair.privateKey.decrypt(data))
        }).on('CHALLENGE_SUCCESS', () => {
            console.log('CHALLENGE SUCCESS')
        }).on('COMMUNICATION', (data) => {
            let deData = decryptData(data, {
                myPrivateKey: this.myKeypair.privateKey,
                herPublickey: this.socket.herPublickey
            })
            console.log('MESSAGE: ', deData)
        })

    }
}