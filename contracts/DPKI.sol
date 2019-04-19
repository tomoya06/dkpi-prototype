pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

contract DPKI {
    
    enum Status { Waiting, Registered }
    
    struct Identity {
        string no;
        string pubkey;
        string DIDHash;
    }
    
    mapping (address => Identity) identities;
    
    event AddedIdentity(address addr);
    event AddedDIDHash(address addr);
    
    function addIdentity(string memory _no, string memory _pubkey) public {
        require(
            bytes(_no).length > 0 &&
            bytes(_pubkey).length > 0, 
            "Illegal Register"
        );
        
        identities[msg.sender] = Identity(
            _no,
            _pubkey,
            ""
        );
        
        emit AddedIdentity(msg.sender);
    }
    
    function saveDIDHash(string memory _fileHash) public {
        identities[msg.sender].DIDHash = _fileHash;
        emit AddedDIDHash(msg.sender);
    }

    function getIdentity(address _addr) public view returns (string memory, string memory, string memory) {
        return (
            identities[_addr].no,
            identities[_addr].pubkey,
            identities[_addr].DIDHash
        );
    }
    
    function getIdentityNumber() public pure returns (uint) {
        return 0;
    }
    
}
