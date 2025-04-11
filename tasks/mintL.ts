import { task } from "hardhat/config";
import { LToken } from "../typechain-types"

task("mintL", "Mint L tokens to a specified address (requires MINTER_ROLE)")
    .addParam("to", "Address to receive the minted tokens")
    .addParam("amount", "Amount of tokens to mint (in wei)")
    .addParam("tokenaddress", "Address of the L token contract")
    .setAction(async (args, hre) => {
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        console.log("Minting L tokens with account:", deployer.address);
        console.log("Using L token contract at:", args.tokenaddress);

        const MyContract = await ethers.getContractFactory("LToken");
        const contract = MyContract.attach(args.tokenaddress) as LToken;

        console.log(`Minting ${args.amount} L tokens to ${args.to}`);

        try {
            const tx = await contract.mint(args.to, args.amount);
            await tx.wait();

            const balance = await contract.balanceOf(args.to);
            console.log(`Minting successful. Current balance of ${args.to}: ${balance}`);
        } catch (error) {
            console.error("Error minting tokens:", error);
            console.log("Make sure the caller has the MINTER_ROLE");
        }
    });