import { task } from "hardhat/config";
import { LToken } from "../typechain-types"

task("approveL", "Approve a contract address to spend L tokens")
    .addParam("spender", "Contract address to approve")
    .addParam("amount", "Amount of tokens to approve (in wei)")
    .setAction(async (args, hre) => {
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        console.log("Approving L tokens with account:", deployer.address);

        const MyContract = await ethers.getContractFactory("LToken");

        // L token address
        const contract = MyContract.attach("0x5D6C04B0AA084c95b5F4f09fF3e9F9c5120Ef8FD") as LToken;

        // Mainnet L token address
        //const contract = MyContract.attach("0x5D6...") as LToken;

        console.log(`Approving ${args.amount} L tokens to be spent by ${args.spender}`);

        const tx = await contract.approve(args.spender, args.amount);
        await tx.wait();

        const allowance = await contract.allowance(deployer.address, args.spender);
        console.log(`Approval successful. Current allowance: ${allowance}`);
    });