import { task } from "hardhat/config";
import { XLToken, LToken } from "../typechain-types"

task("addXLWhiteList", "Whitelist an address")
  .addParam("addr", "The address to whitelist")
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("XLToken");
    const contract = MyContract.attach("0x5D6C04B0AA084c95b5F4f09fF3e9F9c5120Ef8FD") as XLToken; //mainnet
    //const contract = MyContract.attach("0x8E37190Bf2d959ffc4Fe0987f5890BBc7Cb3Bb2f") as XLToken;  // testnet 


    await contract.connect(deployer).addWhitelisted(args.addr);

    console.log(`Address ${args.address} has been whitelisted.`);
  });




task("addLWhiteList", "Whitelist an address")
  .addParam("addr", "The address to whitelist")
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("LToken");
    const contract = MyContract.attach("0xB014083f30Dc82AC18E82e9112c66455D26bC517") as LToken; // testnet 

    await contract.connect(deployer).addWhitelisted(args.addr);

    console.log(`Address ${args.address} has been whitelisted.`);
  });