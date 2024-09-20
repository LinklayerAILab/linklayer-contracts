import { task } from "hardhat/config";
import { Punk } from "../typechain-types"

task("mintnft", "mint nft")
  .addParam("recipient", "recipient") 
//   .addParam("uri", "token uri") 
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const MyContract = await ethers.getContractFactory("Punk");
    const nft = MyContract.attach("0xcE1CC1Aa4e1CeE97b13c9E650A7Be66345D7D04f") as Punk;

    await nft.connect(deployer).mintNFT(args.recipient, "test.com");
    console.log("minted");
  });