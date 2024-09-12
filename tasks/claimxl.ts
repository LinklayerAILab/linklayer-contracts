import { task } from "hardhat/config";
import { XLToken,LToken } from "../typechain-types"

task("claimxl", "claim xl token")
  .addParam("recipient", "recipient") 
  .addParam("amt", "xl amount") 
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("XLToken");
    const contract = MyContract.attach("0x369CfCcb23810c12c27FC456263485153a1b42De") as XLToken;

    const amtconvert = ethers.parseEther(args.amt);

    await contract.connect(deployer).claim(args.recipient, amtconvert,{ value: ethers.parseEther("88") });
    console.log(`claim ${args.amt} xl token to ${args.recipient}`);

    const balance = await contract.balanceOf(args.recipient);
    console.log(`balance: ${balance}`);
  });