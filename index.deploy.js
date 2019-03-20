const Web3 = require('web3')

const {
    deployContract,
    unlockAccount,
    callContractTest,
    sendContractTest
} = require("./lib/ethapi")

const contract = require('./build/contracts/DPKI.json')

const w3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'))

const user = {
    address: '0x14effaed062d2000cd8113cbb9417a7d6fd5d1de',
}

const deployed = {
    address: '0x20bffEAB48771AD3fF7BbCaEa8f468494F4cC7b7',
}

unlockAccount(w3, user.address, '111').then((result) => {
    if (!result) return 
    deployContract(w3, contract, user.address)
})

