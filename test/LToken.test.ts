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

        console.log("L deployed to:", await token.getAddress());
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

    describe("Claim", function () {
        it("Should fail if the amount of ERB is insufficient", async function () {
            const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
            console.log(`Owner balance before: ${ethers.formatEther(ownerBalanceBefore)} ETH`);

            const transaction = await owner.sendTransaction({
                to: whitelister.address,
                value: ethers.parseEther("1")
            });
            await transaction.wait();

            const receiverBalance = await ethers.provider.getBalance(whitelister.address);
            console.log(`Whitelister balance: ${ethers.formatEther(receiverBalance)} ETH`);


            await token.mint(whitelister.address, 100);
            await token.addWhitelisted(await whitelister.getAddress());
        });

        it("Should transfer the correct amount of ERB  and mint L", async function () {
            expect(await token.balanceOf(burner.address)).to.equal(0);
            expect(await ethers.provider.getBalance(burner.address)).to.equal(ethers.parseEther("10000"));

            await token.connect(owner).claim(burner.address, 88, { value: ethers.parseEther("1") })

            expect(await ethers.provider.getBalance(burner.address)).to.equal(ethers.parseEther("10001"));
            expect(await token.balanceOf(burner.address)).to.equal(88);
            // 打印totoal supply
            console.log(`Total supply-------: ${await token.totalSupply()}`);
        });
    });

});