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
        this.isAuthened = false
        this.eventInit()
    }
    // methods begin

    eventInit() {
        // events begin
        const addedIdentityEvt = this.dpkiInstance.AddedIdentity(null, (error, result) => {
            if (error) {
                console.log(error)
                return 
            } else {
                console.log(result)
                let _signee = result.args.addr
                this.addSigner(_signee)
            }
        })

        const addedSignerEvt = this.dpkiInstance.AddedSigner(null, (error, result) => {
            if (error) {
                console.log(error)
                return 
            } else {
                console.log(result)
                const { signer, signee } = result.args
                if (signee === this.ethConfig.user.address) {
                    console.log('IM HAVE BEEN ADDED SIGNER')
                } 
                if (signer === this.ethConfig.user.address) {
                    // TODO: CREATE CERT FILE, SAVE IT AND GENERATE HASH
                    let hash 
                    this.saveCertFileHash(signee, hash)
                }
            }
        })

        const signedIdentityEvt = this.dpkiInstance.SignedIdentity(null, (error, result) => {
            if (error) {
                console.log(error)
                return 
            } else {
                console.log(result)
                const { signer, signee } = result.args
                if (signee === this.ethConfig.user.address) {
                    console.log('IM LEGIT NOW')
                }
            }
        })

        // events end
    }

    contractFunctionFactory(funcName, ...params) {
        return new Promise((resolve, reject) => {
            this.dpkiInstance[funcName](...params, {
                from: this.ethConfig.user.address,
                gas: this.txConfig.gas
            }, (error, result) => {
                resolve([error, result])
            })
        })
    }

    emitAddedIdentity() {
        this.contractFunctionFactory('emitAddedIdentity')
            .then(([error, result])=> {
                if (error) return 
                console.log(`EMITED ADDEDIDENTITY`)
            })
    }

    addIdentity(pubKey) {
        this.contractFunctionFactory('addIdentity', pubKey)
            .then(([error, result]) => {
                if (error) return 
                console.log(`TX hash: ${result}`)
            })
    }

    addSigner(signee) {
        this.contractFunctionFactory('addSigner', signee)
            .then(([error, result]) => {
                if (error) return 
                console.log(`TX hash: ${result}`)
            })
    }

    saveCertFileHash(signee, filehash) {
        this.contractFunctionFactory('saveCertFileHash', signee, filehash)
            .then(([error, result]) => {
                if (error) return 
                console.log(`TX hash: ${result}`)
            })
    }

    async getIdentity(addr) {
        const [error, result] = await this.contractFunctionFactory('getIdentity', addr)
        if (error) return null
        return {
            no: result[0].toString(),
            pubkey: result[1],
            signerAddr: result[2],
            certFileHash: result[3]
        }
    }

    async getIdentityNumber() {
        const [error, no] = await this.contractFunctionFactory('getIdentityNumber')
        if (error) return null
        return no.toString()
    }
}
