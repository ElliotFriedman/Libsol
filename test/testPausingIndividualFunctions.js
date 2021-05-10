
const MockContractToPause = artifacts.require("MockContractToPause");
const { expect } = require("chai");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

let pause;

const sig = function(string) {
    const ret = web3.utils.keccak256(string)
        .split("")
        .splice(0, 10)
        .join("");

    return ret;
}

describe("Test Pausing Functions", () => {
    before(async () => {
        const sigArr = ["pauseFunction(string)", "unPauseFunction(string)"];
        const hashedSigArr = sigArr.map(e => {return sig(e)});

        pause = await MockContractToPause.new(hashedSigArr);
    });
  
    it("get correct function signatures", async () => {
        const funcSig = "getFunctionSignatureHash(string)"
        const funcSigHashed = sig(funcSig);

        expect(funcSigHashed)
            .to.be.equal(
                await pause.getFunctionSignatureHash(funcSig)
            );
    });
  
    it("should be able to call the functionToPause before the function is paused", async () => {
        const funcSig = "getFunctionSignatureHash(string)"
        const funcSigHashed = sig(funcSig);

        expect(funcSigHashed)
            .to.be.equal(
                await pause.getFunctionSignatureHash(funcSig)
            );
    });
  
    it("should be able to pause the functionToPause", async () => {
        const funcSig = "functionToPause(uint256,uint256)";
        const funcSigHashed = sig(funcSig);

        const tx = await pause.pauseFunction(funcSig);

        await expectEvent(tx, "StatusChanged", {
            signature: funcSigHashed,
            status: true
        });

        expect(
            await pause.pausedFunctions(funcSigHashed)
        ).to.be.true;
    });

    it("should not be able to call the functionToPause after the function is paused", async () => {
        await expectRevert(
            pause.functionToPause(1, 2),
            "function paused"
        );
    });

    it("should not be able to pause the unpausable", async () => {
        await expectRevert(
            pause.pauseFunction("pauseFunction(string)"),
            "cannot pause unpauseable"
        );
    });
});
