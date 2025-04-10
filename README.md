# LinkLayerAI XL token

Redeem XL ERC20 token with point rewards to achieve value circulation

## Requirements

```shell
node v16.14.0
npm v7.24.2

[install nvm & node]
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install 16.14.0
nvm use 16.14.0

[install npm]
npm install npm@7.24.2 -g
```

## set up

### upgrade plugin

```shell
npm i @openzeppelin/hardhat-upgrades
npm install --save-dev @nomicfoundation/hardhat-ethers ethers
```

## compile

```shell
npx hardhat compile
```

## test

```shell
npx hardhat test
```

## deploy
>
> If there is no change in the implementation, then every time this script is executed, the proxy contract address will change

```shell
npx hardhat deployXL --network erbieTestNet
npx hardhat deployXL --network erbieMainNet
```

```shell
npx hardhat deployL --network erbieTestNet
npx hardhat deployL --network erbieMainNet
```

## upgrade
>
> Note that a network must be established. If it is for testing, NPX hard hat node can be used, and then -- network localhost
> Otherwise, you will encounter this error. Don't look like an ERC 1967 proxy with a logical contract address
> Contract upgrade, there will be a delay in hre.upgrades.erc1967. getImplementeAddress

```shell
npx hardhat upgrade --proxyaddr <proxy addr> --network erbieTestNet
npx hardhat upgrade --proxyaddr <proxy addr> --network erbieMainNet

npx hardhat upgradeL --proxyaddr <proxy addr> --network erbieTestNet
npx hardhat upgradeL --proxyaddr <proxy addr> --network erbieMainNet
```

## add addr to whitelist

```shell
## grant xl 
npx hardhat addXLWhiteList --addr <addr> --network erbieTestNet
npx hardhat addXLWhiteList --addr <addr> --network erbieMainNet

## grant l
npx hardhat addLWhiteList --addr <addr> --network erbieTestNet
npx hardhat addXLWhiteList --addr <addr> --network erbieMainNet



npx hardhat addXLWhiteList --addr 0xDb85D05039408E9bD4644AB3527CBD2fcbbbD527 --network erbieMainNet
npx hardhat addXLWhiteList --addr 0x651C90B37E88e68aaC134D12DCE52E133f8116b7 --network erbieMainNet
npx hardhat addXLWhiteList --addr 0x1F49b7F54960CA8a56eea5a01be54A5f71185544 --network erbieMainNet


npx hardhat addLWhiteList --addr 0xDb85D05039408E9bD4644AB3527CBD2fcbbbD527 --network erbieMainNet
npx hardhat addLWhiteList --addr 0x651C90B37E88e68aaC134D12DCE52E133f8116b7 --network erbieMainNet
npx hardhat addLWhiteList --addr 0x1F49b7F54960CA8a56eea5a01be54A5f71185544 --network erbieMainNet


npx hardhat addXLWhiteList --addr 0xDb85D05039408E9bD4644AB3527CBD2fcbbbD527 --network erbieTestNet
npx hardhat addXLWhiteList --addr 0x651C90B37E88e68aaC134D12DCE52E133f8116b7 --network erbieTestNet
npx hardhat addXLWhiteList --addr 0x1F49b7F54960CA8a56eea5a01be54A5f71185544 --network erbieTestNet


npx hardhat addLWhiteList --addr 0xDb85D05039408E9bD4644AB3527CBD2fcbbbD527 --network erbieTestNet
npx hardhat addLWhiteList --addr 0x651C90B37E88e68aaC134D12DCE52E133f8116b7 --network erbieTestNet
npx hardhat addLWhiteList --addr 0x1F49b7F54960CA8a56eea5a01be54A5f71185544 --network erbieTestNet

npx hardhat addLWhiteList --addr 0x8a06b59f2877825898f44DA006DeE79d3f8C6C65 --network erbieMainNet
npx hardhat addLWhiteList --addr 0xaEc7583613030AeBEF7B609baefe66902e13d8Ac --network erbieMainNet

```

## claim xl token

```shell
npx hardhat claimxl  --recipient  --amt  --network erbieTestNet
npx hardhat addXLWhiteList --addr <addr> --network erbieMainNet


## get version
npx hardhat version   --network erbieTestNet
npx hardhat version   --network erbieMainNet

## getbalance
npx hardhat balance --recipient   --network erbieMainNet

npx hardhat balance --addr  0x4a13c2a6fF127C8843c274EbAaeAF8cCc6dB5dE0  --network erbieMainNet
npx hardhat balance --addr  0x3b06628b73dAE19CE15AD93eE70d97D1f79BcBC7  --network erbieMainNet
npx hardhat balance --addr  0x429F64ef0764F191aA0B23cbb486040285fe73B7  --network erbieMainNet
npx hardhat balance --addr  0x92C07A6549f084D6a774DCA6F2Eb6bc5058Bd1EB  --network erbieMainNet
npx hardhat balance --addr  0xdD81a1a26434C757739D547582D62cB4cf56e08c  --network erbieMainNet

## release token
npx hardhat realease   --network erbieMainNet
npx hardhat balance --addr  0x3b06628b73dAE19CE15AD93eE70d97D1f79BcBC7  --network erbieMainNet
npx hardhat balance --addr  0x429F64ef0764F191aA0B23cbb486040285fe73B7  --network erbieMainNet
npx hardhat balance --addr  0x92C07A6549f084D6a774DCA6F2Eb6bc5058Bd1EB  --network erbieMainNet


## approve token
npx hardhat approveXL --spender <erbieBridge address> --amount <amount>
npx hardhat approveL --spender <erbieBridge address> --amount <amount>
