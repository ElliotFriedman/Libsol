pragma solidity 0.8.0;

contract FunctionPausability {

    // whitelist certain functions and stop them from ever being able to be paused
    constructor(bytes4[] memory whiteListFuncSigHashes) public {
        for (uint256 i = 0; i < whiteListFuncSigHashes.length; i++) {
            _unPauseableFunctions[
                whiteListFuncSigHashes[i]
            ] = true;
        }

        _unPauseableFunctions[this.getFunctionSignatureHash.selector] = true;
    }

    event StatusChanged(bytes4 signature, bool status);

    // paused functions
    mapping (bytes4 => bool) private _pausedFunctions;
    // if a function is unpauseable, it cannot be paused
    mapping (bytes4 => bool) private _unPauseableFunctions;

    function pausedFunctions(bytes4 signature) public view returns (bool) {
        return _pausedFunctions[signature];
    }

    function unPauseableFunctions(bytes4 signature) public view returns (bool) {
        return _unPauseableFunctions[signature];
    }

    function _setPauseStatus(bytes4 funcSig, bool status) private {
        _pausedFunctions[funcSig] = status;

        emit StatusChanged(funcSig, status);
    }

    function _pauseFunction(bytes4 funcSig) internal {
        require(
            _unPauseableFunctions[funcSig] == false,
            "cannot pause unpauseable"
        );

        _setPauseStatus(funcSig, true);
    }
    
    function _unPauseFunction(bytes4 funcSig) internal {
        _setPauseStatus(funcSig, false);
    }
    
    modifier whileFunctionNotPaused {
        require(
            _pausedFunctions[getCalledFunctionSignature()] == false,
            "function paused"
        );
        _;
    }

    function getCalledFunctionSignature() private pure returns (bytes4) {
        bytes32 x;
        // we have to use assembly to load up the first 32 bytes from msg.data
        // if we don't use assembly, we will deal with all sorts of type casting
        // issues around fixed and dynamic bytes
        assembly {
            x := calldataload(0)
        }
        return bytes4(x);
    }

    function getFunctionSignatureHash(string memory signature) public pure returns(bytes4) {
        return bytes4(
            keccak256(
                abi.encodePacked(
                    signature
                )
            )
        );
    }
}