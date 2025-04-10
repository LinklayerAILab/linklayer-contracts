import { task } from "hardhat/config";
import { XLToken } from "../typechain-types"

task("approveXL", "Approve a contract address to spend XL tokens")
    .addParam("spender", "Contract address to approve")
    .addParam("amount", "Amount of tokens to approve (in wei)")
    .setAction(async (args, hre) => {
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        console.log("Approving XL tokens with account:", deployer.address);

        const MyContract = await ethers.getContractFactory("XLToken");
        // Mainnet XL token address
        //const contract = MyContract.attach("0x5D6C04B0AA084c95b5F4f09fF3e9F9c5120Ef8FD") as XLToken;

        // For testnet, uncomment the following line and comment the line above
        const contract = MyContract.attach("0x8E37190Bf2d959ffc4Fe0987f5890BBc7Cb3Bb2f") as XLToken;

        console.log(`Approving ${args.amount} XL tokens to be spent by ${args.spender}`);

        const tx = await contract.approve(args.spender, args.amount);
        await tx.wait();

        const allowance = await contract.allowance(deployer.address, args.spender);
        console.log(`Approval successful. Current allowance: ${allowance}`);
    });