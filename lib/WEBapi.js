const fs = require('fs')

const app = require('express')()
const httpServer = require('http').Server(app)
const socketio = require('socket.io')(httpServer)

const {
    signData,
    verifyData,
    initCipher,
    cipherData,
    decipherData
} = require('./CERTapi')

const {
    catBufferFromIPFS
} = require('./IPFSapi')

async function getCertOnline(query) {
    const { hash } = query
    return JSON.parse(await catBufferFromIPFS(hash))
}

function _encryptSend(socket, data, keys) {
    const {
        cipher,
        herPublickey,
        myPrivateKey
    } = keys
    const enData = cipherData(data, cipher)
    const enCipher = herPublickey.encrypt(JSON.stringify(cipher))
    const signature = signData(data, myPrivateKey)
    socket.send({
        enData,
        enCipher,
        signature
    })
}

function _decryptData(data, keys) {
    const {
        enData,
        enCipher,
        signature
    } = data
    const {
        myPrivateKey,
        herPublickey
    } = keys
    const cipher = JSON.parse(myPrivateKey.decrypt(enCipher))
    const deData = decipherData(enData, cipher)
    if (!verifyData(deData, signature, herPublickey)) {
        return null
    }
    return deData
}

function init(port) {
    httpServer.listen(port)

    socketio.use(function(socket, next) {
        socket.isAccepted = false
        const certFile = await getCertOnline(socket.handshake.query)
        socket._challenge = Math.floor(Math.random() * 1000)
        socket.emit('challenge', socket._challenge)
        
        socket.on('challenge_response', function(data) {
            if (true) {
                socket.off('challenge')
                socket.off('chanllenge_response')
                next()
            } else {
                next(new Error('not authorized'))
            }
        })
    })
    
    socketio.on('connection', function(socket) {
        console.log('NEW CONNECTION')
        // socket.send("A MESSAGE")
        _encryptSend(socket, "MESSAGE", {
            cipher: initCipher(),
            herPublickey: socket.cert.publicKey[0].key,
            myPrivateKey: ''
        })
    
        socket.on('message', function(data) {
            if (!socket.isAccepted) {
                return 
            }
            const deData = _decryptData(data, {
                myPrivateKey: '',
                herPublickey: socket.cert.publicKey[0].key
            })
        })
    })
}

init(80)
