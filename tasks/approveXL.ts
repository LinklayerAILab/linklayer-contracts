import { task } from "hardhat/config";
import { XLToken } from "../typechain-types"

task("approveXL", "Approve a contract address to spend XL tokens")
    .addParam("spender", "Contract address to approve")
    .addParam("amount", "Amount of tokens to approve (in wei)")
    .addParam("tokenaddress", "Address of the XL token contract")
    .setAction(async (args, hre) => {
        try {
            const { ethers, network } = hre;
            const [deployer] = await ethers.getSigners();

            console.log("Approving XL tokens with account:", deployer.address);
            console.log("Network:", network.name);

            const MyContract = await ethers.getContractFactory("XLToken");
            const contractAddress = args.tokenaddress;
            
            console.log(`Using XL token contract at: ${contractAddress}`);
            const contract = MyContract.attach(contractAddress) as XLToken;

            console.log(`Approving ${args.amount} XL tokens to be spent by ${args.spender}`);

            const tx = await contract.approve(args.spender, args.amount);
            await tx.wait();

            const allowance = await contract.allowance(deployer.address, args.spender);
            console.log(`Approval successful. Current allowance: ${allowance}`);
        } catch (error) {
            console.error("Error occurred:", error);
            throw error;
        }
    });