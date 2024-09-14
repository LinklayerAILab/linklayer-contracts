import { task } from "hardhat/config";
import { XLToken,LToken } from "../typechain-types"

task("addXLWhiteList", "Whitelist an address")
  .addParam("addr", "The address to whitelist") 
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("XLToken");
    const contract = MyContract.attach("0xCBD46A2D6c99A7B8daa2C35DE2aEad37Aa36f506") as XLToken;

    await contract.connect(deployer).addWhitelisted(args.addr);

    console.log(`Address ${args.address} has been whitelisted.`);
  });




  task("addLWhiteList", "Whitelist an address")
  .addParam("addr", "The address to whitelist") 
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("LToken");
    const contract = MyContract.attach("0x9c5e37716861A7e03976fb996228c00D31Dd40Ea") as LToken;

    await contract.connect(deployer).addWhitelisted(args.addr);

    console.log(`Address ${args.address} has been whitelisted.`);
  });