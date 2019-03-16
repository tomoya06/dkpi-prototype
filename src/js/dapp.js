// Init web3, then init contract

App = {
    web3Provider: null,
    contracts: {},

    initWeb3: async function () {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                await window.ethereum.enable();
            } catch (error) {
                console.error("User denied account access")
            }
        }
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('DPKI.json', function (data) {
            var DPKIArtifact = data;
            App.contracts.DPKI = TruffleContract(DPKIArtifact);
            App.contracts.DPKI.setProvider(App.web3Provider);

            return App.markAdopted();
        });
    },
};