

import { task } from "hardhat/config";
import { XLToken } from "../typechain-types"

task("realease", "realease xl token")
    .setAction(async (args, hre) => {
        const { ethers } = hre;
        const [deployer] = await ethers.getSigners();

        const MyContract = await ethers.getContractFactory("XLToken");
        //const contract = MyContract.attach("0x8E37190Bf2d959ffc4Fe0987f5890BBc7Cb3Bb2f") as XLToken;  // testnet xl
        const contract = MyContract.attach("0x5D6C04B0AA084c95b5F4f09fF3e9F9c5120Ef8FD") as XLToken;  // mainnet xl 

        // call releaseLinear method
        await contract.connect(deployer).releaseLinear();
        console.log(`----------releaseLinear------------`);

        // ecosystemFundAddress balance
        const balance = await contract.balanceOf("0x3b06628b73dAE19CE15AD93eE70d97D1f79BcBC7");
        // strategicFinanceAddress balance
        const balance2 = await contract.balanceOf("0x429F64ef0764F191aA0B23cbb486040285fe73B7");
        // 0x92C07A6549f084D6a774DCA6F2Eb6bc5058Bd1EB
        const balance3 = await contract.balanceOf("0x92C07A6549f084D6a774DCA6F2Eb6bc5058Bd1EB");

        console.log(`balance: ${balance}`);
        console.log(`balance2: ${balance2}`);
        console.log(`balance3: ${balance3}`);
        
    });