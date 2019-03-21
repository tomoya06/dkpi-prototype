const Web3 = require('web3')
const BigNumber = require('bignumber.js')

const contract = require('./build/contracts/DPKI.json')

const w3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

const deployed = {
    address: '0xa6cc34ab1d070c59979c51e696681cd1cdcaeff0'
}

const user = {
    address: '0x6c28d287a566caac85119443d4ae9290960dfd4d'
}

const DPKI = w3.eth.contract(contract.abi)
const dpkiInstance = DPKI.at(deployed.address)

// dpkiInstance.addIdentity('fake_id', 'fake_pub', {
//     from: user.address,
//     gas: 5000000,
// }, (error, result) => {
//     if (error) {
//         console.log(error)
//     } else {
//         console.log(result)
//     }
// })

dpkiInstance.getIdentity("0x6c28d287a566caac85119443d4ae9290960dfd4d", {
    from: user.address,
    gas: 5000000,
}, (error, result) => {
    if (error) {
        console.log(error)
    } else {
        console.log(result)
    }
})