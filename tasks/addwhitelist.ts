import { task } from "hardhat/config";
import { XLToken,LToken } from "../typechain-types"

task("addXLWhiteList", "Whitelist an address")
  .addParam("addr", "The address to whitelist") 
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("XLToken");
    const contract = MyContract.attach("0x369CfCcb23810c12c27FC456263485153a1b42De") as XLToken;

    await contract.connect(deployer).addWhitelisted(args.addr);

    console.log(`Address ${args.address} has been whitelisted.`);
  });




  task("addLWhiteList", "Whitelist an address")
  .addParam("addr", "The address to whitelist") 
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("LToken");
    const contract = MyContract.attach("0x9Cc40AeF41EE42eD4E36eD53550633c44dF4b795") as LToken;

    await contract.connect(deployer).addWhitelisted(args.addr);

    console.log(`Address ${args.address} has been whitelisted.`);
  });