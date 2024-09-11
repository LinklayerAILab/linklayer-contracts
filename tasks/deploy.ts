import { task } from "hardhat/config";
import { XLToken, LToken } from "../typechain-types"


task("deployXL", "deploy xl token contract")
    .setAction(async (args, hre) => {
        let token: XLToken;
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        const taskIncentiveAddress = "0x61EDC056a11048fF0B8296871A48730D9d51B90B"
        const ecosystemFundAddress = "0xE6cEa9c34a8395478F1faF1f266e595FF464a668"
        const strategicFinanceAddress = "0x002E73CaaBD414eeaFE0fe3ecA18F4c7D9069207"
        const teamAddress = "0xc11BcFb7Ce6E58A49c7C78fEf5924a2594fB220B"
        const marketingAddress = "0x44fdC8202a018894F240Fe12fb31595cd22aa3D3"


        const XLToken = await ethers.getContractFactory("XLToken");

        token = await hre.upgrades.deployProxy(XLToken, [deployer.address,
            taskIncentiveAddress, ecosystemFundAddress, strategicFinanceAddress,
            teamAddress, marketingAddress]) as unknown as XLToken;
        await token.waitForDeployment();

        // proxy address 
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

        // proxy address  0xa4db5cB5614cd71dF825584DB79356BbA8258929
        console.log("L deployed to:", await token.getAddress());

        // implementation address 0x11bD179dCB1faa0BBd5318D0379b8146Fef40e9C
        console.log("L implementation address:", await hre.upgrades.erc1967.getImplementationAddress(await token.getAddress()));
    })