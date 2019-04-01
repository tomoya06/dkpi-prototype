const fs = require('fs')
const forge = require('node-forge')
const _ = require('lodash')

function initCipher() {
    const key = forge.random.getBytesSync(16)
    const iv = forge.random.getBytesSync(8)
    return {
        key,
        iv
    }
}

function signData(data, privateKey) {
    const md = forge.md.sha256.create()
    md.update(data)
    const signature = privateKey.sign(md)
    return signature
}

function verifyData(data, signature, publicKey) {
    const md = forge.md.sha256.create()
    md.update(data)
    return publicKey.verify(md.digest().bytes(), signature)
}

function cipherData(data, cipher) {
    const { key, iv } = cipher
    const cipher = forge.cipher.createCipher('AES-CBC', key)
    cipher.start({ iv })
    cipher.update(data)
    cipher.finish()
    return cipher.output
}

function decipherData(data, cipher) {
    const { key, iv } = cipher
    const decipher = forge.cipher.createDecipher('AES-CBC', key)
    decipher.start({ iv })
    decipher.update(data)
    const res = decipher.finish()
    if (!res) {
        return null
    }
    return decipher.output
}

function generateKeyPair() {
    const rsa = forge.pki.rsa
    const keypair = rsa.generateKeyPair({ bits: 2048, e: 0x10001 })
    return {
        type: 'rsa',
        publicKey: keypair.publicKey,
        privateKey: keypair.privateKey
    }
}

function _objectTypeCheck(demo, val) {
    for (let prop in demo) {
        if (val[`${prop}`]) {
            if (typeof demo[`${prop}`] === 'string') {
                if (typeof val[`${prop}`] !== demo[`${prop}`]) {
                    return false
                }
            } else if (demo[`${prop}`] instanceof Array) {
                if (!val[`${prop}`] instanceof Array) {
                    return false
                }
                if (val[`${prop}`].some((item) => !_objectTypeCheck(demo[`${prop}`][0], item))) {
                    return false
                }
            } else if (typeof demo[`${prop}`] === 'object') {
                if (!_objectTypeCheck(demo[`${prop}`], val[`${prop}`])) {
                    return false
                }
            }
        } else {
            return false
        }
    }
    return true
}

function generateDIDcert(options) {
    const demo = {
        'id': 'number',
        'identity': {
            'ipAddr': 'string',
            'bcAddr': 'string'
        },
        'publicKey': [{
            'id': 'string',
            'type': 'string',
            'key': 'string',
            'controller': 'string'
        }],
        'authentication': {
            'ipAddr': 'string',
            'bcAddr': 'string'
        }
    }

    if (!_objectTypeCheck(demo, options)) {
        return null
    }

    return JSON.stringify(options)
}

// const options = {
//     id: 1,
//     identity: {
//         ipAddr: 'ffff',
//         bcAddr: 'ffff'
//     },
//     publicKey: [{
//         id: 'dddd',
//         type: 'ddd',
//         publicKeyPem: 'pppp',
//         controller: 'cccc'
//     }],
//     authentication: {
//         ipAddr: 'gggg',
//         bcAddr: 'bbbb'
//     }
// }

// generateDIDcert(options)

module.exports = {
    initCipher,
    signData,
    verifyData,
    cipherData,
    decipherData,
    generateKeyPair,
    generateDIDcert
}
