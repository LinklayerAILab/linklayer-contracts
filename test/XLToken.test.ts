import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { XLToken } from "../typechain-types"

describe("XL", function () {
    let token: XLToken;
    let owner: any;
    let minter: any;
    let burner: any;
    let whitelister: any;

    beforeEach(async function () {
        [owner, minter, burner, whitelister] = await ethers.getSigners();
        const XLToken = await ethers.getContractFactory("XLToken");

        token = await upgrades.deployProxy(XLToken, [owner.address]) as unknown as XLToken;
        await token.waitForDeployment();

        console.log("XL deployed to:", await token.getAddress());
    });

    describe("Deployment", function () {
        it("Should assign the initial supply to the owner", async function () {
            expect(await token.balanceOf(owner.address)).to.equal(1000000);
        });
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
    });

    describe("Claim", function () {
        it("Should fail if the sender is not whitelisted", async function () {
            await expect(token.connect(minter).claim(owner.address, 100, { value: ethers.parseEther("0") })).to.be.revertedWith("XL: Caller is not whitelisted");
        });

        it("Should fail if the sender does not have enough XL balance", async function () {
            await token.addWhitelisted(minter.address);
            await expect(token.connect(minter).claim(owner.address, 100, { value: ethers.parseEther("0") })).to.be.revertedWithCustomError(token, "InsufficientXLBalance");
        });

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

            await expect(token.connect(whitelister).claim(owner.address, 10, { value: ethers.parseEther("20000000") })).to.be.rejectedWith("Sender doesn't have enough funds to send tx. The max upfront cost is: 20000000036010831620000000 and the sender's balance is: 10001000000000000000000");
        });

        it("Should transfer the correct amount of XL and ERB", async function () {
            expect(await token.balanceOf(burner.address)).to.equal(0);  
            expect(await ethers.provider.getBalance(burner.address)).to.equal(ethers.parseEther("10000"));

            await token.connect(owner).claim(burner.address, 100, { value: ethers.parseEther("1") })

            expect(await ethers.provider.getBalance(burner.address)).to.equal(ethers.parseEther("10001"));
            expect(await token.balanceOf(burner.address)).to.equal(100);
        });
    });
});