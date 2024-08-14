# Erbie XL token
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
```shell
npx hardhat deployXL --network localhost
```

## upgrade
> Note that a network must be established. If it is for testing, NPX hard hat node can be used, and then -- network localhost
> Otherwise, you will encounter this error. Don't look like an ERC 1967 proxy with a logical contract address
```shell
npx hardhat upgrade --proxyaddr <proxy addr> --network localhost
```
