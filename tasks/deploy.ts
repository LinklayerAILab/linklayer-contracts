import { task } from "hardhat/config";
import { XLToken,LToken } from "../typechain-types"


task("deployXL", "deploy xl token contract")
    .setAction(async (args, hre) => {
        let token: XLToken;
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();
        const XLToken = await ethers.getContractFactory("XLToken");

        token = await hre.upgrades.deployProxy(XLToken, [deployer.address]) as unknown as XLToken;
        await token.waitForDeployment();

        // proxy address 0x1F22e90d61D08c4B327139728902682CA2bCb042
        console.log("XL deployed to:", await token.getAddress());
       
        // implementation address
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

        // proxy address 
        console.log("L deployed to:", await token.getAddress());
       
        // implementation address
        console.log("L implementation address:", await hre.upgrades.erc1967.getImplementationAddress(await token.getAddress()));
    })