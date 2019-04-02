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

function _checkCertFileOnline(cert) {
    for (let i=0; i<1000; i++) { Date.now() }
    return true
}

function _authCheck(query) {
    try {
        const {
            certFile
        } = query
        if (!_checkCertFileOnline(certFile)) {
            throw new Error('INVALID CERT')
        }
        return certFile
    } catch (error) {
        console.error(error)
        return null
    }
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
        const cert = _authCheck(socket.handshake.query)
        if (!cert) {
            return next(new Error('NOT AUTHORIZED'))
        }
        
        Object.defineProperty(socket, 'cert', {
            value: cert,
            writable: false,
            configurable: false,
            enumerable: false
        })
        return next()
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
            const deData = _decryptData(data, {
                myPrivateKey: '',
                herPublickey: socket.cert.publicKey[0].key
            })
        })
    })
}

init(80)
