
const PullOwnable = artifacts.require("PullOwnable");
const { expect } = require("chai");
const {
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

let ownable;
let owner;
let newOwner;
let nonOwner;
let accounts;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";

describe("Test New Ownable Contracts", () => {
    before(async () => {
        accounts = await web3.eth.getAccounts();

        owner = accounts[0];
        newOwner = accounts[1];
        nonOwner = accounts[2];
    });

    beforeEach(async () => {
        ownable = await PullOwnable.new(owner);
        expect(owner).to.be.equal(await ownable.getOwner());
    });

    // helper function
    async function nominateOwner(newOwnerAddress) {        
        const tx = await ownable.nominateNewOwner(newOwnerAddress, { from: owner });
    
        await expectEvent(tx, "StartOwnershipTransfer", {
            newOwner: newOwnerAddress,
        });
    
        expect(newOwnerAddress).to.be.equal(await ownable.getNewOwner());
    }

    // helper function
    async function claimOwnerShip(oldOwner, newOwner) {
        const tx = await ownable.takeOwnershipAsNewOwner({ from: newOwner });
    
        await expectEvent(tx, "OwnershipTransferred", {
            newOwner: newOwner,
            oldOwner: oldOwner,
        });
    
        expect(newOwner).to.be.equal(await ownable.getOwner());
        expect(ZERO_ADDRESS).to.be.equal(await ownable.getNewOwner());
    }
  
    it("should be able to nominate new owner", async () => {
        await nominateOwner(newOwner);
    });

    it("newly nominated owner should be able to claim ownership", async () => {
        await nominateOwner(newOwner);
        await claimOwnerShip(owner, newOwner);
    });

    it("nominated owner address can be changed multiple times as long as ownership is not claimed", async () => {
        await nominateOwner(newOwner);
        await nominateOwner(ADDRESS_ONE);
        await nominateOwner(newOwner);
    });

    it("cannot nominate owner with address 0", async () => {
        await expectRevert(
            ownable.nominateNewOwner(ZERO_ADDRESS, { from: owner }),
            "invalid address"
        );
    });

    it("cannot nominate new owner if you arent the current owner", async () => {
        await expectRevert(
            ownable.nominateNewOwner(newOwner, { from: nonOwner }),
            "!owner"
        );
    });

    it("cannot take ownership if you aren't the new owner", async () => {
        await nominateOwner(newOwner);
        await expectRevert(
            ownable.takeOwnershipAsNewOwner({ from: nonOwner }),
            "!new owner"
        );
    });
});
