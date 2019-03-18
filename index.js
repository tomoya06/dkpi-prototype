const Web3 = require('web3')
const contract = require('./src/contract')

const w3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'))

const user = {
    address: '0xbd84ab4cafae0d3657c7d1272ee519cc19ca6557'
}

const dpkiInstance = new w3.eth.Contract(contract.abi, contract.address, {
    from: user.address,
})

dpkiInstance.methods.getIdentityNumber().call().then(result => console.log(result))

let addedIdentityEvt = dpkiInstance.events.AddedIdentity((error, result) => {
    if (error) {
        return console.error(error)
    }
    console.log(`[ADDED IDENTITY EVT]: ${result}`)
})

