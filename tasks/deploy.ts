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

        // proxy address  0x369CfCcb23810c12c27FC456263485153a1b42De
        console.log("XL deployed to:", await token.getAddress());

        // implementation address 0xb74FeAdF69611C0470e96A552Ae1b4B7cF03D3E1
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

        // proxy address  0x9Cc40AeF41EE42eD4E36eD53550633c44dF4b795
        console.log("L deployed to:", await token.getAddress());

        // implementation address 0x19ff4463fC9FF122D7D393950E5FEB80fFb0464d
        console.log("L implementation address:", await hre.upgrades.erc1967.getImplementationAddress(await token.getAddress()));
    })