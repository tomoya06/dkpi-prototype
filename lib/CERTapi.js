const selfsigned = require('selfsigned')
const crypto = require('crypto')

const keypair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    }
})

let pems = selfsigned.generate(null, {
    publicKey: keypair.publicKey,
    privateKey: keypair.privateKey,
    keySize: 2048,
    algorithm: 'sha256',
})
console.log(pems)