import { task } from "hardhat/config";
import { XLToken, LToken } from "../typechain-types"

task("balance", "Get token balance for an address")
    .addParam("addr", "Address to query balance for")
    .addParam("token", "Token type (XL or L)")
    .addParam("tokenaddress", "Token contract address")
    .setAction(async (args, hre) => {
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        if (args.token.toUpperCase() === "XL") {
            const MyContract = await ethers.getContractFactory("XLToken");
            const contract = MyContract.attach(args.tokenaddress) as XLToken;
            const balance = await contract.balanceOf(args.addr);
            console.log(`XL balance for ${args.addr}: ${balance}`);
        } else if (args.token.toUpperCase() === "L") {
            const MyContract = await ethers.getContractFactory("LToken");
            const contract = MyContract.attach(args.tokenaddress) as LToken;
            const balance = await contract.balanceOf(args.addr);
            console.log(`L balance for ${args.addr}: ${balance}`);
        } else {
            console.error("Invalid token type. Use 'XL' or 'L'");
        }
    });