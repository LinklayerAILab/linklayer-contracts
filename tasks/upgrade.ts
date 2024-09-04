import { task, types } from "hardhat/config";
import { XLToken,LToken } from "../typechain-types"


task("upgrade", "upgrade XLToken")
    .addParam("proxyaddr", "proxy address")
    .setAction(async (args, hre) => {
        let token: XLToken;
        const { ethers } = hre;
        // upgrade XLToken to XLTokenV2 
        // Keep the contract name unchanged 
        const XLTokenV2 = await ethers.getContractFactory("XLToken");
        token = await hre.upgrades.upgradeProxy(args.proxyaddr, XLTokenV2) as unknown as XLToken;
        console.log("XLToken upgraded to:", await token.getAddress());
        // new impl address
        console.log("XLTokenV2 implementation address:", await hre.upgrades.erc1967.getImplementationAddress(await token.getAddress()));
    })

 
    task("upgradeL", "upgrade LToken")
    .addParam("proxyaddr", "proxy address")
    .setAction(async (args, hre) => {
        let token: LToken;
        const { ethers } = hre;
        // upgrade LToken to LTokenV2 
        // Keep the contract name unchanged 
        const LTokenV2 = await ethers.getContractFactory("LToken");
        token = await hre.upgrades.upgradeProxy(args.proxyaddr, LTokenV2) as unknown as LToken;
        console.log("LToken upgraded to:", await token.getAddress());
        // new impl address
        console.log("LTokenV2 implementation address:", await hre.upgrades.erc1967.getImplementationAddress(await token.getAddress()));
    })