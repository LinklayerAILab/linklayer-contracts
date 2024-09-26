import { task } from "hardhat/config";
import { Punk,GameItems } from "../typechain-types"

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


  //npx hardhat minterc1155 --recipient 0x15b1049c7F8Fb1b5F1Cba8236EAc0e77fBEE4E66 --network erbieTestNet
  task("minterc1155", "mint erc1155 token")
  .addParam("recipient", "recipient") 
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const gameItemsFac = await ethers.getContractFactory("GameItems");
    const gameItems = gameItemsFac.attach("0x03CFF07122b8e82418bd9152763516f7141a2c39") as GameItems;

    await gameItems.connect(deployer).mint(args.recipient, 0,88);
    console.log("erc1155 minted");
  });