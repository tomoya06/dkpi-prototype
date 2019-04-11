pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

contract DPKI {
    
    enum Status { Waiting, Registered }
    
    struct Identity {
        uint no;
        string pubkey;
        string DIDHash;
    }
    
    mapping (address => Identity) identities;
    
    uint identityNumber;
    
    event AddedIdentity(address addr);
    event AddedDIDHash(address addr);
    
    function addIdentity(string memory _pubkey) public {
        require(
            identities[msg.sender].no == 0 &&
            bytes(_pubkey).length > 0, 
            "Illegal Register"
        );
        
        identityNumber++;
        
        identities[msg.sender] = Identity(
            identityNumber,
            _pubkey,
            ""
        );
        
        emit AddedIdentity(msg.sender);
    }
    
    function saveDIDHash(string memory _fileHash) public {
        identities[msg.sender].DIDHash = _fileHash;
        emit AddedDIDHash(msg.sender);
    }

    function getIdentity(address _addr) public view returns (uint, string memory, string memory) {
        return (
            identities[_addr].no,
            identities[_addr].pubkey,
            identities[_addr].DIDHash
        );
    }
    
    function getIdentityNumber() public view returns (uint) {
        return identityNumber;
    }
    
}
