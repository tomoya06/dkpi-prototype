const fs = require('fs')
const forge = require('node-forge')
const path = require('path')

const pki = forge.pki

function generateKeyPair() {
    const keypair = pki.rsa.generateKeyPair(2048)
    return keypair
}

function generatePriKeyPem(keypair) {
    return pki.publicKeyToPem(keypair.privateKey)
}

/**
 * generate cert file
 * @param {string} commonName hostname or ip address
 * @param {pki.rsa.keypair.publicKey} pubkey public key to be secured
 * @param {string} serialNO serial number of cert in string
 * @param {pki.rsa.keypair.privateKey} signerPrikey private key to sign the cert
 * @param {Date} expireAt timestamp when the cert will expire, default Date.now() + 1yr
 * @returns pem of cert 
 */
function generateCertPem(commonName, pubkey, serialNO, signerPrikey, expireAt) {
    const cert = pki.createCertificate()
    cert.publicKey = pubkey
    cert.serialNumber = '0000'.substring(0, 4 - serialNO.length) + serialNO
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    if (expireAt) {
        cert.validity.notAfter = expireAt
    } else {
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)
    }
    const attrs = [{
        name: 'commonName',
        value: commonName
    }, {
        name: 'countryName',
        value: 'CN'
    }, {
        name: 'organizationName',
        value: 'Test'
    }]
    cert.setSubject(attrs)
    cert.setIssuer(attrs)
    // cert.setExtensions([{
    //     name: 'basicConstraints',
    //     cA: true
    // }, {
    //     name: 'keyUsage',
    //     keyCertSign: true,
    //     digitalSignature: true,
    //     nonRepudiation: true,
    //     keyEncipherment: true,
    //     dataEncipherment: true
    // }, {
    //     name: 'extKeyUsage',
    //     serverAuth: true,
    //     clientAuth: true,
    //     codeSigning: true,
    //     emailProtection: true,
    //     timeStamping: true
    // }, {
    //     name: 'nsCertType',
    //     client: true,
    //     server: true,
    //     email: true,
    //     objsign: true,
    //     sslCA: true,
    //     emailCA: true,
    //     objCA: true
    // }, {
    //     name: 'subjectKeyIdentifier'
    // }])
    cert.sign(signerPrikey)
    var pem = pki.certificateToPem(cert)
    return pem
}

function writePem2File(pem, filename, filepath) {
    fs.writeFileSync(path.resolve(__dirname, filepath, `${filename}.pem`), pem.toString(), {
        flag: 'w'
    })
}

// const keypairA = generateKeyPair()
// const keypairB = generateKeyPair()
// const pemA = generateCertFile('example.org', keypairA.publicKey, 1, keypairB.privateKey)
// writePem2File(pemA, 'pem_a')

// return 0


module.exports = {
    generateCertPem,
    generatePriKeyPem,
    generateKeyPair,
    writePem2File
}
