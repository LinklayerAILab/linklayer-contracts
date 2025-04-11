import { task } from "hardhat/config";
import { LToken } from "../typechain-types"

task("approveL", "Approve a contract address to spend L tokens")
    .addParam("spender", "Contract address to approve")
    .addParam("amount", "Amount of tokens to approve (in wei)")
    .addParam("tokenaddress", "Address of the L token contract")
    .setAction(async (args, hre) => {
        try {
            const { ethers, network } = hre;
            const [deployer] = await ethers.getSigners();

            console.log("Approving L tokens with account:", deployer.address);
            console.log("Network:", network.name);

            const MyContract = await ethers.getContractFactory("LToken");
            const contractAddress = args.tokenaddress;
            
            console.log(`Using L token contract at: ${contractAddress}`);
            const contract = MyContract.attach(contractAddress) as LToken;

            console.log(`Approving ${args.amount} L tokens to be spent by ${args.spender}`);

            const tx = await contract.approve(args.spender, args.amount);
            await tx.wait();

            const allowance = await contract.allowance(deployer.address, args.spender);
            console.log(`Approval successful. Current allowance: ${allowance}`);
        } catch (error) {
            console.error("Error occurred:", error);
            throw error;
        }
    });