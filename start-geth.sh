#!/bin/bash
geth --datadir ./geth_data --networkid 7555 --ws --wsapi="eth,web3,personal" console --wsorigins="*"
# geth --datadir ./geth_data --networkid 7555 --ws --wsapi="eth,web3,personal,utils" --wsorigins="*" --rpc --rpcapi="eth,web3,personal,utils"  console
# geth --datadir ./geth_data --networkid 7555 --rpc --rpcapi="eth,web3,personal" console --wsorigins="*"
