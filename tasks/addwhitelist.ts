import { task } from "hardhat/config";
import { XLToken } from "../typechain-types"

task("addWhiteList", "Whitelist an address")
  .addParam("addr", "The address to whitelist") 
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("XLToken");
    const contract = MyContract.attach("0x1F22e90d61D08c4B327139728902682CA2bCb042") as XLToken;

    await contract.connect(deployer).addWhitelisted(args.addr);

    console.log(`Address ${args.address} has been whitelisted.`);
  });