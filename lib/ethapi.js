function unlockAccount(w3, address, passwd, duration = 600) {
    return w3.eth.personal.unlockAccount(address, passwd, duration)
}

function deployContract(w3, contractJSON, address) {
    new w3.eth.Contract(contractJSON.abi).deploy({
        data: contractJSON.bytecode,
    }).send({
        from: address,
        gas: 1500000,
    }).then((dpkiInstance) => {
        console.log(dpkiInstance.options.address)
    })
}

module.exports = {
    deployContract,
    unlockAccount
}