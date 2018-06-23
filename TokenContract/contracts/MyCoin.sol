pragma solidity ^0.4.2;

/**
 * Simple Contract to save task 
 * details on blockchain
 **/
contract MyCoin {
    struct contributor {
		bytes32 userName;
		uint[] taskList;
		uint256 tokensCount;
	}

    address[] public contributorList; // Array of contributors address

    /* Mapping addresses to contributor object */
    mapping (address => contributor) public contributorDetails;

    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor() public {
        contributorDetails[msg.sender].userName = "mujtaba";
        contributorDetails[msg.sender].tokensCount = 5000;
    }

    function createContributor(address contributorAdd, bytes32 name, uint taskName) public {
        contributorDetails[contributorAdd].userName = name;
        contributorDetails[contributorAdd].taskList.push(taskName);
        contributorList.push(contributorAdd);
    }
    
    function addTask(address contributorAdd, uint taskName) public {
        contributorDetails[contributorAdd].taskList.push(taskName);
    }

    function isContributed(address _walletAdd, uint taskName) public view returns (bool){
        uint arraySize = contributorDetails[_walletAdd].taskList.length;
        uint[] storage taskArray = contributorDetails[_walletAdd].taskList;
        for(uint i = 0; i < arraySize; i++){
            if( taskArray[i] == taskName ){
                return true;
            }
        }
        return false;
    }

    function validContributor(address _walletAdd) public view returns (bool) {
        for(uint i = 0; i < contributorList.length; i++){
            if( contributorList[i] == _walletAdd )
               return true;
        }
        return false;
    }
    
    
    function getContributorDetails(address contributorAdd) public view returns (bytes32, uint256[], uint256) {
        bytes32 name = contributorDetails[contributorAdd].userName;
        uint256[] memory taskList = new uint256[](contributorDetails[contributorAdd].taskList.length);
        taskList = contributorDetails[contributorAdd].taskList;
        uint256 token = contributorDetails[contributorAdd].tokensCount;
        return(name, taskList, token);
    }

    function transfer(address _to) public payable returns (bool) {
        uint256 _value=10;
        require(contributorDetails[msg.sender].tokensCount >= _value);           // Check if the sender has enough
        contributorDetails[msg.sender].tokensCount -= _value;                    // Subtract from the sender
        contributorDetails[_to].tokensCount += _value;                           // Add the same to the recipient
        return true;
    }
}