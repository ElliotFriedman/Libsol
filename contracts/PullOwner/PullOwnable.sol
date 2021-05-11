pragma solidity ^0.8.0;

contract PullOwnable {

    // current owner
    address private _owner;
    // newly nominated owner that hasn't claimed their ownership yet
    address private _newOwner;

    // event to signal that the process to transfer ownership has started
    event StartOwnershipTransfer(address indexed newOwner);
    // event to signal that ownership has been transferred
    event OwnershipTransferred(address indexed newOwner, address indexed oldOwner);

    // construct contract and create a new owner
    constructor (address owner) public {
        _owner = owner;

        emit OwnershipTransferred(owner, address(0));
    }

    // get current owner
    function getOwner() public view returns (address) {
        return _owner;
    }

    // get new owner
    function getNewOwner() public view returns (address) {
        return _newOwner;
    }

    modifier onlyOwner {
        require(msg.sender == getOwner(), "!owner");
        _;
    }

    modifier onlyNewOwner {
        require(msg.sender == getNewOwner(), "!new owner");
        _;
    }

    function nominateNewOwner(address newOwner) onlyOwner public {
        require(newOwner != address(0), "invalid address");

        _newOwner = newOwner;

        emit StartOwnershipTransfer(newOwner);
    }

    function takeOwnershipAsNewOwner() onlyNewOwner public {
        require(_newOwner != address(0), "invalid new owner");

        address tmpOldOwner = _owner;

        _owner = _newOwner;
        _newOwner = address(0);

        emit OwnershipTransferred(_owner, tmpOldOwner);
    }
}