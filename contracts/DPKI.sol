pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

contract DPKI {
    
    enum Status { Waiting, Registered }
    
    struct Identity {
        uint no;
        string pubkey;
        address signer;
        string certFileHash;
    }
    
    mapping (address => Identity) identities;
    
    uint identityNumber;
    
    event AddedIdentity(address addr);
    event AddedSigner(address signee, address signer);
    event SignedIdentity(address signer, address signee);
    // event SavedIdentityCertFile(address owner, string filehash);
    // event UpdateIdentityInfo(address owner, string infoName, string newValue, string certFileHash);
    
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
            address(0),
            ""
        );
        
        emit AddedIdentity(msg.sender);
    }
    
    function emitAddedIdentity() public {
        require(
            identities[msg.sender].signer == address(0)
        );
        emit AddedIdentity(msg.sender);
    }
    
    function addSigner(address _signee) public {
        require(
            _signee != msg.sender &&
            identities[_signee].signer == address(0) &&
            bytes(identities[_signee].certFileHash).length == 0,
            "Illegal Add Signer Process"
        );
        
        identities[_signee].signer = msg.sender;
        
        emit AddedSigner(_signee, msg.sender);
    }
    
    function saveCertFileHash(address _signee, string memory _fileHash) public {
        require(
            identities[_signee].signer == msg.sender &&
            msg.sender != _signee &&
            bytes(identities[msg.sender].pubkey).length > 0 &&
            bytes(identities[_signee].pubkey).length > 0 &&
            identities[_signee].signer == address(0) &&
            bytes(identities[_signee].certFileHash).length == 0,
            "Illegal Signature Process"
        );
        
        identities[_signee].signer = msg.sender;
        identities[_signee].certFileHash = _fileHash;
        
        emit SignedIdentity(msg.sender, _signee);
    }

    function getIdentity(address _addr) public view returns (uint, string memory, address, string memory) {
        require(identities[_addr].no >= 0, "This Address Has No Identity Yet");

        return (
            identities[_addr].no,
            identities[_addr].pubkey,
            identities[_addr].signer,
            identities[_addr].certFileHash
        );
    }
    
    function getIdentityNumber() public view returns (uint) {
        return identityNumber;
    }
    
}
