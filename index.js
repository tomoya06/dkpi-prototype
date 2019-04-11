const { 
    generateKeyPair,
    generatePEM
} = require('./lib/CERTapi')
const DPKI = require('./lib/DPKIapi')

let userConfig

async function main() {
    let argv = require('minimist')(process.argv.slice(2))
    let configPath = argv['p']
    if (!configPath) {
        console.log('YOU NEED TO PASS A CONFIG FILE BY ADDING -p')
        return
    }
    
    userConfig = require(`${configPath}`)
    if (!userConfig.user || !userConfig.user.address) {
        console.log('ILLEGAL CONFIG FILE')
        return
    }
    
    const dpki = new DPKI(userConfig)
    let idNum = await dpki.getIdentityNumber()
    console.log(idNum)

    const keypair = generateKeyPair()
    let pem = generatePEM(keypair)
    await dpki.addIdentity(pem.pub)
    
    idNum = await dpki.getIdentityNumber()
    console.log(idNum)

    let myID = await dpki.getIdentity(userConfig.user.address)
    console.log(JSON.stringify(myID))
}

main()