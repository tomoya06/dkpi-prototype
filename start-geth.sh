#!/bin/bash
geth --datadir ./geth_data --networkid 7555 --ws --wsapi="eth,web3,personal" console --wsorigins="*" --mine --minerthreads="1"
