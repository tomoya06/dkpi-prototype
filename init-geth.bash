#!/bin/bash
rm -rf ./geth_data/geth &&
geth --datadir ./geth_data init ./geth_data/genesis.json
