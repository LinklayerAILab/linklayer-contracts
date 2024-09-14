import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "./tasks/deploy"
import "./tasks/upgrade"
import "./tasks/addwhitelist"
import "./tasks/claimxl"
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    erbieTestNet: {
      url: "http://192.168.1.235:8560",
      accounts: [process.env.PRIVATE_KEY || ""], // if use erbieTestNet, you need to set your private key to .env
      chainId: 51888,
    },
    erbieMainNet: {
      url: "http://192.168.84.240:8560",
      accounts: [process.env.PRIVATE_KEY || ""], // if use erbieMainNet, you need to set your private key to .env
      chainId: 50888,
    }
  },
};

export default config;
