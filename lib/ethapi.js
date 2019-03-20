function unlockAccount(w3, address, passwd, duration = 600) {
    return w3.eth.personal.unlockAccount(address, passwd, duration)
}

function deployContract(w3, contractJSON, address) {
    new w3.eth.Contract(contractJSON.abi).deploy({
        data: contractJSON.bytecode,
    }).send({
        from: address,
        gas: 1500000,
    }, (error, result) => {
        console.log(error, ' | tx hash:', result)
    }).on('error', (error) => console.log(error))
    .on('transactionHash', (transactionHash) => console.log(transactionHash))
    .on('receipt', (receipt) => {
        console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', (confirmationNumber, receipt) => { 
        console.log(confirmationNumber, receipt) 
    }).then((dpkiInstance) => {
        console.log(dpkiInstance.options.address)
    })
}

function callContractTest(w3, contractJSON, ctAddress, callerAddress) {
    const dpkiInstance = new w3.eth.Contract(contractJSON.abi, ctAddress, {
        from: callerAddress,
    })

    dpkiInstance.methods.getIdentityNumber().call().then(result => console.log(result))

    let addedIdentityEvt = dpkiInstance.events.AddedIdentity({}, (error, result) => {
        if (error) {
            console.error(error)
        } else {
            console.log(result)
        }
    })
        // .then(logs => console.log(logs))
        // .catch(error => console.log(error))
}

function sendContractTest(w3, contractJSON, ctAddress, senderAddress) {
    const dpkiInstance = new w3.eth.Contract(contractJSON.abi, ctAddress, {
        from: senderAddress,
    })

    dpkiInstance.methods.addIdentity('fake_id', 'fake_pub').send({
        from: senderAddress,
    }, (error, result) => {
        if (error) {
            console.error(error)
        } else {
            console.log(result)
        }
    })
}

module.exports = {
    deployContract,
    unlockAccount,
    callContractTest,
    sendContractTest
}