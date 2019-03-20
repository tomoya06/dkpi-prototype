const Web3 = require('web3')

const contract = require('./build/contracts/DPKI.json')

const w3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

const deployed = {
    address: '0xbd950a85368892b3aaccb0cea1fc0b55a1daf5a4'
}

const user = {
    address: '0x787a5d8e1cde4b0d5190738413c60d85151e8d70'
}

const DPKI = w3.eth.contract(contract.abi)
const dpkiInstance = DPKI.at(deployed.address)

const addedIdentityEvt = dpkiInstance.AddedIdentity(null, (error, result) => {
    if (error) {
        console.log(error)
    } else {
        console.log(result)
    }
})