const socketio = require('socket.io-client')

const {
    encryptSend,
    decryptData,
} = require('./util')

const {
    generatePEM,
    generateCipher,
    revertPubkeyFromPEM
} = require('./CERTapi')

module.exports = class DClient {
    constructor(dpki, myKeypair, url = 'http://localhost:1000') {
        console.log(`WS URL: ${url}`)
        this._log('INITIALIZED')
        this.dpki = dpki
        this.myKeypair = myKeypair
        this.sendCnt = 0

        this.socket = socketio(url, {
            query: {
                pubkey: generatePEM(this.myKeypair).pub,
                addr: this.dpki.ethConfig.user.address
            }
        })
        this.socket.on('connect', () => {
            this._log('CONNECTED')
            // console.log('CONNECTED')
        }).on('AUTH', (query) => {
            this._log('ON_AUTH')
            if (!query.pubkey || !query.addr) {
                return next(new Error('CONNECTION QUERY FAILED'))
            }
            this.socket.herPublickey = revertPubkeyFromPEM(query.pubkey)
            this.socket.challenge = Math.floor(Math.random() * 99999).toString()
            this.socket.isChallenged = false
            this.socket.emit('CHALLENGE', this.socket.herPublickey.encrypt(this.socket.challenge))
            this._log('SEND_CHALLENGE')
        }).on('CHALLENGE_RESPONSE', (data) => {
            this._log('ON_CHALLENGE_RESPONSE')
            if (data === this.socket.challenge) {
                console.log('CHALLENGE PASSED')
                this.socket.emit('CHALLENGE_SUCCESS')
                this.socket.isChallenged = true
            } else {
                console.log('CHALLENGE FAILED')
                this.socket.close()
            }
        }).on('CHALLENGE', (data) => {
            // console.log('RECEIVED CHALLENGE FROM SERVER...')
            this._log('ON_CHALLENGE')
            this.socket.emit('CHALLENGE_RESPONSE', this.myKeypair.privateKey.decrypt(data))
        }).on('CHALLENGE_SUCCESS', () => {
            // console.log('CHALLENGE SUCCESS')
            this._log('ON_CHALLENGE_SUCCESS')
        }).on('COMMUNICATION', (data) => {
            this._log('ON_COMMUNICATION')
            let deData = decryptData(data, {
                myPrivateKey: this.myKeypair.privateKey,
                herPublickey: this.socket.herPublickey
            })
            console.log('MESSAGE: ', deData)
        }).on('RECEIVED', () => {
            this._log('MSG_RECEIVED')
            console.log()
        })

    }

    send(data, evt = undefined) {
        if (!this.socket.isChallenged) {
            return
        }
        this.sendCnt++
        this._log('SEND_MESSAGE_' + this.sendCnt)
        encryptSend(this.socket, data, {
            cipher: generateCipher(),
            herPublickey: this.socket.herPublickey,
            myPrivateKey: this.myKeypair.privateKey
        }, evt)
    }

    getlog() {
        return this.stages.map(item => {
            return {
                name: item.name,
                delta: item.delta
            }
        })
    }

    _log(name) {
        if (!this.stages) {
            this.stages = [{
                name: 'NOTHING',
                time: Date.now(),
                delta: 0
            }]
        }
        let now = Date.now()
        this.stages.push({
            name,
            time: now,
            delta: now - this.stages[this.stages.length - 1].time
        })
    }
}