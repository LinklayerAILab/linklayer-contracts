import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { XLToken,LToken } from "../typechain-types"

describe("L", function () {
    let token: LToken;
    let owner: any;
    let minter: any;
    let burner: any;
    let whitelister: any;



    beforeEach(async function () {
        [owner, minter, burner, whitelister] = await ethers.getSigners();
        const LToken = await ethers.getContractFactory("LToken");


        token = await upgrades.deployProxy(LToken, [owner.address]) as unknown as LToken;
        await token.waitForDeployment();

        console.log("XL deployed to:", await token.getAddress());
    });

    describe("Roles", function () {
        // The owner has permissions for admin, mint, burner, and whitelist simultaneously
        it("Should assign the admin role to the owner", async function () {
            expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
        });

        it("Should assign the minter role to the minter", async function () {
            expect(await token.hasRole(await token.MINTER_ROLE(), owner.address)).to.equal(true);
        });

        it("Should assign the burner role to the burner", async function () {
            expect(await token.hasRole(await token.BURNER_ROLE(), owner.address)).to.equal(true);
        });

        it("Should assign the whitelister role to the whitelister", async function () {
            expect(await token.hasRole(await token.WHITELISTED_ROLE(), owner.address)).to.equal(true);
        });

        // The owner authorizes Minter, who in turn has Minter's permission
        it("Should assign the minter role to the minter", async function () {
            await token.grantRole(await token.MINTER_ROLE(), minter.address);
            expect(await token.hasRole(await token.MINTER_ROLE(), minter.address)).to.equal(true);
        });

        // addWhitelisted 
        it("Should assign the whitelister role to the whitelister", async function () {
            await token.addWhitelisted(whitelister.address)
            expect(await token.hasRole(await token.WHITELISTED_ROLE(), whitelister.address)).to.equal(true);
        });
    });

});