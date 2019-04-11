const _ = require('lodash')
const forge = require('node-forge')

const { sleep } = require('./util')

let userConfig = require('./users/eth_config.json')
const DPKI = require('./lib/DPKIapi')

async function main() {
    const dpki = new DPKI(userConfig)
    let idNum = await dpki.getIdentityNumber()
    console.log(idNum)
    
    const pki = forge.pki
    const keypair = pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 })
    let pubkeyPem = pki.publicKeyToPem(keypair.publicKey)
    await dpki.addIdentity(pubkeyPem)

    idNum = await dpki.getIdentityNumber()
    console.log(idNum)
    
    while (!dpki.isAuthened) {
        console.log('NOT BEEN SIGNED YET')
        sleep(1000)
    }

    let myID = dpki.getIdentity(userConfig.user.address)
    console.log(idNum, JSON.stringify(myID))
}

main()