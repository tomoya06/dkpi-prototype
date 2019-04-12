const {
    signData,
    verifyData,
    cipherData,
    decipherData
} = require('./CERTapi')

function sleep(mill) {
    let startTime = Date.now()
    while (Date.now() - startTime < mill) {}
}

function encryptSend(socket, data, keys, evt = 'COMMUNICATION') {
    const {
        cipher,
        herPublickey,
        myPrivateKey
    } = keys
    const enData = cipherData(data, cipher)
    const enCipher = herPublickey.encrypt(JSON.stringify(cipher))
    const signature = signData(data, myPrivateKey)
    socket.emit(evt, {
        enData,
        enCipher,
        signature
    })
}

function decryptData(data, keys) {
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

module.exports = {
    sleep,
    encryptSend,
    decryptData
}