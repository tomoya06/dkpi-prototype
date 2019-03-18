const Web3 = require('web3')
const contract = require('./src/contract')

const w3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

const user = {
    address: '0xfc4da2ff7252a1ac83d2e8e161eeae36f2e82a04'
}

const dpkiInstance = new w3.eth.Contract(contract.abi, contract.address, {
    from: user.address,
})

dpkiInstance.methods.getIdentityNumber().call().then(result => console.log(result))



