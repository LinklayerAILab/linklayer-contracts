import { task } from "hardhat/config";
import { XLToken, LToken, Punk } from "../typechain-types"


task("deployXL", "deploy xl token contract")
    .setAction(async (args, hre) => {
        let token: XLToken;
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        const taskIncentiveAddress = "0x4a13c2a6fF127C8843c274EbAaeAF8cCc6dB5dE0"
        const ecosystemFundAddress = "0x3b06628b73dAE19CE15AD93eE70d97D1f79BcBC7"
        const strategicFinanceAddress = "0x429F64ef0764F191aA0B23cbb486040285fe73B7"
        const teamAddress = "0x92C07A6549f084D6a774DCA6F2Eb6bc5058Bd1EB"
        const marketingAddress = "0xdD81a1a26434C757739D547582D62cB4cf56e08c"


        const XLToken = await ethers.getContractFactory("XLToken");

        token = await hre.upgrades.deployProxy(XLToken, [deployer.address,
            taskIncentiveAddress, ecosystemFundAddress, strategicFinanceAddress,
            teamAddress, marketingAddress]) as unknown as XLToken;
        await token.waitForDeployment();

        // proxy address  0x5D6C04B0AA084c95b5F4f09fF3e9F9c5120Ef8FD  mainnet
        // proxy address 0x8E37190Bf2d959ffc4Fe0987f5890BBc7Cb3Bb2f testnet
        console.log("XL deployed to:", await token.getAddress());

        // implementation address  0x8601C4af66E72d2fb89BcB57a4a8d1e4727a22ED mainnet
        // implementation address  0x085b5a830aA2bA07F56C302Fe6Df265f62A11392 testnet
        console.log("XL implementation address:", await hre.upgrades.erc1967.getImplementationAddress(await token.getAddress()));
    })

task("deployL", "deploy l token contract")
    .setAction(async (args, hre) => {
        let token: LToken;
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();
        const LToken = await ethers.getContractFactory("LToken");

        token = await hre.upgrades.deployProxy(LToken, [deployer.address]) as unknown as LToken;
        await token.waitForDeployment();

        // proxy address  0x9c5e37716861A7e03976fb996228c00D31Dd40Ea  mainnet
        // proxy address 0xB014083f30Dc82AC18E82e9112c66455D26bC517 testnet 
        console.log("L deployed to:", await token.getAddress());

        // implementation address 0x92F33Df758937393E5b3949e1a61C9aCeb734A84 mainnet
        // implementation address 0x07A45D1F9ed2661f8Da3a7C786e79784855Fb8b9 testnet
        console.log("L implementation address:", await hre.upgrades.erc1967.getImplementationAddress(await token.getAddress()));
    })



// 0xcE1CC1Aa4e1CeE97b13c9E650A7Be66345D7D04f
// npx hardhat deploynft --network erbieTestNet
task("deploynft", "deploy nft contract")
    .setAction(async (args, hre) => {
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();
        const Punk = await ethers.getContractFactory("Punk");
        const nft = await Punk.connect(deployer).deploy() as Punk;
        await nft.waitForDeployment();
        console.log("nft deployed to:", await nft.getAddress());
    })

