const {
    generateKeyPair,
    generatePKeyPem,
    generateCertPem,
    writePem2File
} = require('../lib/CERTapi')

const keypairA = generateKeyPair()
const keypairB = generateKeyPair()

const pkeyPemA = generatePKeyPem(keypairA)
writePem2File(pkeyPemA, 'test.pkey.A', '../pems')
const pemA = generateCertPem('example.org', keypairA.publicKey, 1, keypairB.privateKey)
writePem2File(pemA, 'test.cert.A', '../pems')

return 0