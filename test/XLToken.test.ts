import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { XLToken } from "../typechain-types"
import { MockXLTokenV2 } from "../typechain-types/contracts/mock/MockXLTokenV2.sol";

describe("XL", function () {
    let token: XLToken;
    let owner: any;
    let minter: any;
    let burner: any;
    let whitelister: any;
    let taskIncentiveAddress: any;
    let ecosystemFundAddress: any;
    let strategicFinanceAddress: any;
    let teamAddress: any;
    let marketingAddress: any;

    const TASK_INCENTIVE_SUPPLY = 800_000_000n * 10n ** 18n;
    const MARKETING_SUPPLY = 200_000_000n * 10n ** 18n;


    beforeEach(async function () {
        [owner, minter, burner, whitelister,
            taskIncentiveAddress, ecosystemFundAddress,
            strategicFinanceAddress, teamAddress, marketingAddress] = await ethers.getSigners();
        const XLToken = await ethers.getContractFactory("XLToken");


        token = await upgrades.deployProxy(XLToken, [owner.address, taskIncentiveAddress.address,
        ecosystemFundAddress.address, strategicFinanceAddress.address,
        teamAddress.address, marketingAddress.address]) as unknown as XLToken;
        await token.waitForDeployment();

        console.log("XL deployed to:", await token.getAddress());
    });

    describe("Deployment", function () {
        it("Should assign the initial supply to the taskIncentiveAddress & marketingAddress", async function () {
            expect(await token.balanceOf(taskIncentiveAddress.address)).to.equal(TASK_INCENTIVE_SUPPLY);
            expect(await token.balanceOf(marketingAddress.address)).to.equal(MARKETING_SUPPLY);
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

        it("Should transfer the correct amount of ERB  and mint XL", async function () {
            expect(await token.balanceOf(burner.address)).to.equal(0);
            expect(await ethers.provider.getBalance(burner.address)).to.equal(ethers.parseEther("10000"));

            await token.connect(owner).claim(burner.address, 100, { value: ethers.parseEther("1") })

            expect(await ethers.provider.getBalance(burner.address)).to.equal(ethers.parseEther("10001"));
            expect(await token.balanceOf(burner.address)).to.equal(100);
        });
    });


    describe("releaseLinear", function () {
        it("Should normal release in the first month", async function () {
            for (let i = 1; i <= 1; i++) {
                await time.increase(30 * 24 * 60 * 60);

                await token.connect(owner).releaseLinear();

                const ecosystemReleased = await token.ecosystemReleased();
                const strategicFinanceReleased = await token.strategicFinanceReleased();
                const teamReleased = await token.teamReleased();

                expect(ecosystemReleased).to.be.greaterThan(0);
                expect(strategicFinanceReleased).to.be.greaterThan(0);
                expect(teamReleased).to.be.equal(0);  // Released quarterly

                expect(await token.balanceOf(ecosystemFundAddress.address)).to.equal(20_000_000n * 10n ** 18n);
                expect(await token.balanceOf(strategicFinanceAddress.address)).to.equal(27777777777777777777777777n);
                expect(await token.balanceOf(teamAddress.address)).to.equal(0);
            }
        });


        it("Should multiple calls are invalid", async function () {
            await time.increase(30 * 24 * 60 * 60);
            for (let i = 1; i <= 4; i++) {
                await token.connect(owner).releaseLinear();

                const ecosystemReleased = await token.ecosystemReleased();
                const strategicFinanceReleased = await token.strategicFinanceReleased();
                const teamReleased = await token.teamReleased();

                expect(ecosystemReleased).to.be.greaterThan(0);
                expect(strategicFinanceReleased).to.be.greaterThan(0);
                expect(teamReleased).to.be.equal(0);  // Released quarterly

                expect(await token.balanceOf(ecosystemFundAddress.address)).to.equal(20_000_000n * 10n ** 18n);
                expect(await token.balanceOf(strategicFinanceAddress.address)).to.equal(27777777777777777777777777n);
                expect(await token.balanceOf(teamAddress.address)).to.equal(0);
            }
        });

        it("Should all should be released in the fifth year", async function () {
            for (let i = 1; i <= 60; i++) {
                await time.increase(30 * 24 * 60 * 60);

                await token.connect(owner).releaseLinear();
            }

            const ecosystemReleased = await token.ecosystemReleased();
            const strategicFinanceReleased = await token.strategicFinanceReleased();
            const teamReleased = await token.teamReleased();

            expect(ecosystemReleased).to.be.greaterThan(0);
            expect(strategicFinanceReleased).to.be.greaterThan(0);
            expect(teamReleased).to.be.greaterThan(0);  // Released quarterly

            expect(await token.balanceOf(ecosystemFundAddress.address)).to.equal(1_200_000_000n * 10n ** 18n);
            expect(await token.balanceOf(strategicFinanceAddress.address)).to.equal(1_000_000_000n * 10n ** 18n);
            expect(await token.balanceOf(teamAddress.address)).to.equal(600_000_000n * 10n ** 18n);
        });


        it("Should will not be released again after 5 years", async function () {
            for (let i = 1; i <= 80; i++) {
                await time.increase(30 * 24 * 60 * 60);

                await token.connect(owner).releaseLinear();
            }

            const ecosystemReleased = await token.ecosystemReleased();
            const strategicFinanceReleased = await token.strategicFinanceReleased();
            const teamReleased = await token.teamReleased();

            expect(ecosystemReleased).to.be.greaterThan(0);
            expect(strategicFinanceReleased).to.be.greaterThan(0);
            expect(teamReleased).to.be.greaterThan(0);  // Released quarterly

            expect(await token.balanceOf(ecosystemFundAddress.address)).to.equal(1_200_000_000n * 10n ** 18n);
            expect(await token.balanceOf(strategicFinanceAddress.address)).to.equal(1_000_000_000n * 10n ** 18n);
            expect(await token.balanceOf(teamAddress.address)).to.equal(600_000_000n * 10n ** 18n);
        });
    
    });


    describe("Upgrade", function () {
        it("Should upgrade contracts", async function () {
            // upgrade XLToken to XLTokenV2
            const XLTokenV2 = await ethers.getContractFactory("MockXLTokenV2");
            token = await upgrades.upgradeProxy(await token.getAddress(), XLTokenV2) as unknown as MockXLTokenV2;
            console.log("XLTokenV2 deployed to:", await token.getAddress());

            expect(await token.TestUpgrade()).to.equal(200);
        });
    });
});