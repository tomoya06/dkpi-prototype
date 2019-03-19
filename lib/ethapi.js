function unlockAccount(w3, address, passwd, duration = 600) {
    return w3.eth.personal.unlockAccount(address, passwd, duration)
}

function deployContract(w3, contractJSON, address) {
    let utils = w3.utils
    try {
        new w3.eth.Contract(contractJSON.abi, '', {
            from: address,
            gasPrice: '10000000000000',
            gas: 1000000,
            data: contractJSON.bytecode,
        }).deploy().send({
            from: address,
            gas: 1500000,
            gasPrice: '30000000000000'
        }).on('error', (error) => {
            console.error(error)
        }).on('receipt', (receipt) => {
            console.log(receipt.contractAddress) // contains the new contract address
        }).then((dpkiInstance) => {
            console.log(dpkiInstance.options.address)
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    deployContract,
    unlockAccount
}