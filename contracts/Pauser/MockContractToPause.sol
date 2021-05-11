pragma solidity ^0.8.0;

import "./FunctionPausability.sol";

contract MockContractToPause is FunctionPausability {

    constructor(bytes4[] memory whiteListFuncSigHashes)
        public
        FunctionPausability(whiteListFuncSigHashes)
    {}

    function pauseFunction(string memory funcSig) public {
        bytes4 signature = getFunctionSignatureHash(funcSig);

        _pauseFunction(signature);
    }

    function unPauseFunction(string memory funcSig) public {
        bytes4 signature = getFunctionSignatureHash(funcSig);

        _unPauseFunction(signature);
    }

    function functionToPause(uint256 a, uint256 b)
        whileFunctionNotPaused
        public
        view
        returns (uint256)
    {
        return a * b;
    }
}