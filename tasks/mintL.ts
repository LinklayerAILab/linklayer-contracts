import { task } from "hardhat/config";
import { LToken } from "../typechain-types"

task("mintL", "Mint L tokens to a specified address (requires MINTER_ROLE)")
    .addParam("to", "Address to receive the minted tokens")
    .addParam("amount", "Amount of tokens to mint (in wei)")
    .setAction(async (args, hre) => {
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        console.log("Minting L tokens with account:", deployer.address);

        const MyContract = await ethers.getContractFactory("LToken");

        // Testnet L token address - update this with the correct address
        const contract = MyContract.attach("0xCBD46A2D6c99A7B8daa2C35DE2aEad37Aa36f506") as LToken;

        // Mainnet L token address - update this with the correct address
        // const contract = MyContract.attach("0x9c5e37716861A7e03976fb996228c00D31Dd40Ea") as LToken;

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