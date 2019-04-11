const Web3 = require('web3')

const contract = require('./../build/contracts/DPKI.json')
const deploy = require('./../users/deploy.json')
// const ethConfig = require('./eth_config.json')

module.exports = class DPKI {
    constructor(config) {
        this.w3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
        this.txConfig = {
            gas: 5000000
        }
        this.ethConfig = config
        this.dpkiContract = this.w3.eth.contract(contract.abi)
        this.dpkiInstance = this.dpkiContract.at(deploy.deploy.address)
        
        // events begin

        const addedIdentityEvt = this.dpkiInstance.AddedIdentity(null, (error, result) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                let _signee = result.args.addr
                this.addSigner(_signee)
            }
        })

        const addedSignerEvt = this.dpkiInstance.AddedSigner(null, (error, result) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
                const { signer, signee } = result.args
                if (signer === this.ethConfig.user.address) {
                    // TODO: CREATE CERT FILE, SAVE IT AND GENERATE HASH
                    let hash 
                    this.saveCertFileHash(signee, hash)
                }
            }
        })

        // events end
    }
    // methods begin

    contractFunctionFactory(funcName, ...params) {
        return new Promise((resolve, reject) => {
            this.dpkiInstance[funcName](...params, {
                from: this.ethConfig.user.address,
                gas: this.txConfig.gas
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

    emitAddedIdentity() {
        this.contractFunctionFactory('emitAddedIdentity')
            .then(result => {
                console.log(`EMIT ADDEDIDENTITY`)
            })
    }

    addIdentity(pubKey) {
        this.contractFunctionFactory('addIdentity', pubKey)
            .then(result => {
                console.log(`TX hash: ${result}`)
            })
    }

    addSigner(signee) {
        this.contractFunctionFactory('addSigner', signee)
            .then(result => {
                console.log(`TX hash: ${result}`)
            })
    }

    saveCertFileHash(signee, filehash) {
        this.contractFunctionFactory('saveCertFileHash', signee, filehash)
            .then(result => {
                console.log(`TX hash: ${result}`)
            })
    }

    async getIdentity(addr) {
        const result = await this.contractFunctionFactory('getIdentity', addr)
        return {
            no: result[0],
            pubkey: result[1],
            signature: result[2],
            signerAddr: result[3],
            certFileHash: result[4]
        }
    }

    async getIdentityNumber() {
        const no = await this.contractFunctionFactory('getIdentityNumber')
        return no.toString()
    }
}
