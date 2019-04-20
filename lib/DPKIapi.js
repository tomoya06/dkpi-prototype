const Web3 = require('web3')

const contract = require('./../build/contracts/DPKI.json')
const deploy = require('./../users/deploy.json')
// const ethConfig = require('./eth_config.json')

module.exports = class DPKI {
    constructor(config, url='http://127.0.0.1:8545') {
        this.w3 = new Web3(new Web3.providers.HttpProvider(url))
        this.txConfig = {
            gas: 5000000
        }
        this.ethConfig = config
        this.dpkiContract = this.w3.eth.contract(contract.abi)
        this.dpkiInstance = this.dpkiContract.at(deploy.deploy.address)
        
        this.eventInit()

        this.addIdentityTX = ''
        this.saveDIDHashTXs = []
    }
    // methods begin

    eventInit() {
        // events begin
        const addedIdentityEvt = this.dpkiInstance.AddedIdentity(null, (error, result) => {
            if (error) {
                console.log(error)
                return 
            } else {
                console.log(`NEW IDENTITY FOR ${result.args.addr}`)
            }
        })

        const addedSignerEvt = this.dpkiInstance.AddedDIDHash(null, (error, result) => {
            if (error) {
                console.log(error)
                return 
            } else {
                console.log(result)
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

    addIdentity(pubKey) {
        const id = `did:demo:${Date.now()}-prototype`
        this.contractFunctionFactory('addIdentity', id, pubKey)
            .then(([error, result]) => {
                if (error) return 
                this.addIdentityTX = result
                console.log(`TX hash: ${result}`)
            })
    }

    saveDIDHash(signee, filehash) {
        this.contractFunctionFactory('saveDIDHash', signee, filehash)
            .then(([error, result]) => {
                if (error) return 
                this.saveDIDHashTXs.push(result)
                console.log(`TX hash: ${result}`)
            })
    }

    async getSelfIdentity() {
        return await this.getIdentity(this.ethConfig.user.address)
    }

    async getIdentity(addr) {
        const [error, result] = await this.contractFunctionFactory('getIdentity', addr)
        if (error) return null
        return {
            no: result[0].toString(),
            pubkey: result[1],
            DIDHash: result[2]
        }
    }

    async getIdentityNumber() {
        const [error, no] = await this.contractFunctionFactory('getIdentityNumber')
        if (error) return null
        return no.toString()
    }
}
