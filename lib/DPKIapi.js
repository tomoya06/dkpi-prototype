const Web3 = require('web3')

const contract = require('./../build/contracts/DPKI.json')
const ethConfig = require('./eth_config.json')

const w3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

const txConfig = {
    gas: 5000000
}

const DPKI = w3.eth.contract(contract.abi)
const dpkiInstance = DPKI.at(ethConfig.deploy.address)

// events begin

const addedIdentityEvt = dpkiInstance.AddedIdentity(null, (error, result) => {
    if (error) {
        console.log(error)
    } else {
        console.log(result)
        // TODO: signee address
        let _signee = result.args.addr
        addSigner(_signee)
    }
})

const addedSignerEvt = dpkiInstance.AddedSigner(null, (error, result) => {
    if (error) {
        console.log(error)
    } else {
        console.log(result)
        const { signer, signee } = result.args
        if (signer === ethConfig.user.address) {
            // TODO: CREATE CERT FILE, SAVE IT AND GENERATE HASH
            let hash 
            saveCertFileHash(signee, hash)
        } 
    }
})

// events end

// methods begin

function unlockAccount() {
    return null
}

function contractFunctionFactory(funcName, ...params) {
    return new Promise((resolve, reject) => {
        dpkiInstance[funcName](...params, {
            from: ethConfig.user.address,
            gas: txConfig.gas
        }, (error, result) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

function addIdentity(ipAddr, pubKey) {
    contractFunctionFactory('addIdentity', ipAddr, pubKey)
        .then(result => {
            console.log(`TX hash: ${result}`)
        })
}

function addSigner(signee) {
    contractFunctionFactory('addSigner', signee)
        .then(result => {
            console.log(`TX hash: ${result}`)
        })
}

function saveCertFileHash(signee, filehash) {
    contractFunctionFactory('saveCertFileHash', signee, filehash)
        .then(result => {
            console.log(`TX hash: ${result}`)
        })
}

// function signIdentity(signee, signature) {
//     contractFunctionFactory('signIdentity', signee, signature)
//         .then(result => {
//             console.log(`TX hash: ${result}`)
//         })
// }

async function getIdentity(addr) {
    const result = await contractFunctionFactory('getIdentity', addr)
    return {
        no: result[0],
        ipAddr: result[1],
        pubkey: result[2],
        signature: result[3],
        signerAddr: result[4],
        certFileHash: result[5]
    }
}

async function getIdentityNumber() {
    const no = await contractFunctionFactory('getIdentityNumber')
    return no.toString()
}

// methods end

getIdentityNumber()
addIdentity('fake_ip', 'fake_pubkey')

module.exports = {
    dpkiInstance,
    addIdentity,
    addSigner,
    saveCertFileHash,
    // signIdentity,
    getIdentity,
    getIdentityNumber
}



