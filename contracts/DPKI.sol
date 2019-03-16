pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

contract DPKI {
    
    enum Status { Waiting, Registered }
    
    struct Identity {
        uint no;
        string ipAddr;
        string pubkey;
        string signature;
        address signer;
        string certFileHash;
    }
    
    mapping (address => Identity) identities;
    mapping (string => address) ipAddresses;
    
    uint identityNumber;
    
    event AddedIdentity(address addr);
    event SignedIdentity(address signer, address signee);
    event SavedIdentityCertFile(address owner, string filehash);
    event UpdateIdentityInfo(address owner, string infoName, string newValue, string certFileHash);
    
    function addIdentity(string memory _ipAddr, string memory _pubkey) public {
        require(
            bytes(_ipAddr).length > 0 &&
            bytes(_pubkey).length > 0 &&
            bytes(identities[msg.sender].ipAddr).length == 0 &&
            ipAddresses[_ipAddr] == address(0), 
            "Illegal Register"
        );
        
        identities[msg.sender] = Identity(
            identityNumber,
            _ipAddr,
            _pubkey,
            "",
            address(0),
            ""
        );
        
        identityNumber++;
        
        emit AddedIdentity(msg.sender);
    }
    
    function signIdentity(address _signee, string memory _signature) public {
        require(
            bytes(identities[msg.sender].signature).length > 0 &&
            bytes(identities[_signee].signature).length == 0 || 
            identities[msg.sender].no == 0 && 
            msg.sender == _signee,
            "Illegal Signature Process"
        );
        
        identities[_signee].signer = msg.sender;
        identities[_signee].signature = _signature;
        
        emit SignedIdentity(msg.sender, _signee);
    }
    
    function saveCertFileHash(string memory _fileHash) public {
        require(
            bytes(identities[msg.sender].certFileHash).length == 0,
            "You Have Owned A Certificate Already"
        );
        
        identities[msg.sender].certFileHash = _fileHash;
        
        emit SavedIdentityCertFile(msg.sender, _fileHash);
    }

    function getIdentity(address _addr) public view returns (uint, string memory, string memory, string memory, address, string memory) {
        require(identities[_addr].no >= 0, "This Address Has No Identity Yet");

        return (
            identities[_addr].no,
            identities[_addr].ipAddr,
            identities[_addr].pubkey,
            identities[_addr].signature,
            identities[_addr].signer,
            identities[_addr].certFileHash
        );
    }
    
}
