# DPKI Prototype 

Graduation Project of tomoya06. Directed by Pro. Long.

## Directory

* auth.xxxx.js: authorization process with OAuth2
* auths.xxx.js: authorization process with zk-snark
* index.xxx.js: did basic process

## Environment

* Development: Ubuntu 18.06 x64 on VMWare / Windows 10
* Application: Debian 9.x amd64 on Raspberry Pi 3 (Facing with compatibility issues. Work on Ubuntu/Windows for now)

## Tools

* Blockchain network: ~~[geth](https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options) (go-ethereum, providing websocket server for event subscription)~~ ganache-cli + remix-ide + remixd (Easy init/deploy. Remix suite provide graphic control tools)
* Smart Contract Compiling: [Truffle](https://truffleframework.com/docs/truffle/overview)
* Dapp Interface: ~~[web3.js 1.0.x-beta](https://web3js.readthedocs.io/en/1.0/) (TOO MANY BUGS. Can't catch event, even with Websocket provider)~~ [web3.js 0.20.x](https://github.com/ethereum/wiki/wiki/JavaScript-API) (Stable API. Work well with PURE HttpProvider in event and method utils. Work well with the blockchain network above) in NodeJS
* Other Utils: 
    * IPFS: [js-ipfs](https://github.com/ipfs/js-ipfs#install), decentralized file system.
    * X.509 Certificate: [forge](https://github.com/digitalbazaar/forge#x509), tool to generate and sign certificate
    * And so on...