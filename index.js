const { 
    generateKeyPair,
    generatePEM
} = require('./lib/CERTapi')
const DPKI = require('./lib/DPKIapi')
const DClient = require('./lib/WEBCapi')
const {
    sleep
} = require('./lib/util')

let userConfig

async function main() {
    let argv = require('minimist')(process.argv.slice(2))
    let configPath = argv['p'] || './users/eth_config.cp.json'
    let sleepTime = parseInt(argv['s'] || '1000')
    if (!configPath) {
        console.log('YOU NEED TO PASS A CONFIG FILE BY ADDING -p')
        return
    }
    userConfig = require(`${configPath}`)
    if (!userConfig.user || !userConfig.user.address) {
        console.log('ILLEGAL CONFIG FILE')
        return
    }
    
    const dpki = new DPKI(userConfig, 'http://192.168.40.1:8545')
    let idNum = await dpki.getIdentityNumber()
    console.log('CURRENT IDENTITY AMOUNT : ' + idNum)

    const keypair = generateKeyPair()
    let pem = generatePEM(keypair)
    await dpki.addIdentity(pem.pub)
    
    idNum = await dpki.getIdentityNumber()
    console.log('CURRENT IDENTITY AMOUNT : ' + idNum)

    let myID = await dpki.getIdentity(userConfig.user.address)
    console.log('IDENTITY: \n' + JSON.stringify(myID))

    console.log(`REGISTERED. SLEEP FOR ${sleepTime}ms...`)
    sleep(sleepTime)
    console.log('WAKE UP')

    console.log('CONNECTING TO SERVER...')
    let dClient = new DClient(dpki, keypair, 'http://192.168.40.1:80')
}

main()