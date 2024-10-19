

import { task } from "hardhat/config";
import { XLToken, LToken } from "../typechain-types"

task("balance", "get version")
    .addParam("addr", "query addr")
    .setAction(async (args, hre) => {
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        const MyContract = await ethers.getContractFactory("XLToken");
        const contract = MyContract.attach("0x8E37190Bf2d959ffc4Fe0987f5890BBc7Cb3Bb2f") as XLToken;  // testnet xl
        //const contract = MyContract.attach("0x5D6C04B0AA084c95b5F4f09fF3e9F9c5120Ef8FD") as XLToken;  // mainnet xl 


        const balance = await contract.balanceOf(args.addr);
        console.log(`balance: ${balance}`);
    });