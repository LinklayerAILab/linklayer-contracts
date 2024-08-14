import { task } from "hardhat/config";
import { XLToken } from "../typechain-types"


task("deployXL", "deploy xl token contract")
    .setAction(async (args, hre) => {
        let token: XLToken;
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();
        const XLToken = await ethers.getContractFactory("XLToken");

        token = await hre.upgrades.deployProxy(XLToken, [deployer.address]) as unknown as XLToken;
        await token.waitForDeployment();

        // 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
        // proxy address
        console.log("XL deployed to:", await token.getAddress());
       
        // implementation address
        console.log("XL implementation address:", await hre.upgrades.erc1967.getImplementationAddress(await token.getAddress()));
    })