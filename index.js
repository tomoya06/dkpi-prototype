const Web3 = require('web3')

const { 
    deployContract,
    unlockAccount
} = require("./lib/ethapi")

const contract = require('./build/contracts/DPKI.json')

const w3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'))

const user = {
    address: '0xb4f45a5ef3ef980b5051b940a0dcb8da5cfb6c59'
}

unlockAccount(w3, user.address, '111').then((result) => {
    if (!result) return 
    deployContract(w3, contract, user.address)
})

// const dpkiInstance = new w3.eth.Contract(contract.abi, contract.address, {
//     from: user.address,
// })

// dpkiInstance.methods.getIdentityNumber().call().then(result => console.log(result))

// let addedIdentityEvt = dpkiInstance.events.AddedIdentity((error, result) => {
//     if (error) {
//         return console.error(error)
//     }
//     console.log(`[ADDED IDENTITY EVT]: ${result}`)
// })

