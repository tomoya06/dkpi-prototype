const DPKI = require('./lib/DPKIapi')

let userConfig = require('./users/eth_config.json')

const dpki = new DPKI(userConfig)

let curIdNum = dpki.getgetIdentityNumber()
console.log(curIdNum)
