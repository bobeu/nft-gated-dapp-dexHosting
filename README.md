# Project Name:
- SwapLab

# Author: 
- Isaac J. 
  - Solidity/Web3 developer/Frontend.
  - Ambassador
  - Content creator

# Description

SwapLab is a small project built from Celosage tutorial that showcase how to build a Dapp that exchanges ERC20 token to $Celo coin. It comprises the smart contract and frontend to interact with it. $CELOG token was created to act as a test token that will be exchanged for $CELO.


# Technology
The smart contract is deployed on Celo testnet - Alfajores.

# Stack
- Smart contract:
  - Solidity
  - Hardhat
  - Typescript

- Frontend: 
  - NextJs
  - MaterialUI
  - Reactjs
  - Typescript

- Deployment
The tutorial is deployed on decentralized hosting service - IPFS using Spheron as a gateway. Use this **[link](https://nft-gated-dapp-dexhosting-1b22e1.spheron.app/)** to interact with the demo app.

# How to run

Compile, test and deploy contract:

- Git clone https://github.com/bobeu/nft-gated-dapp-dexHosting.git
- cd nft-gated-dapp-dexHosting/backend
- yarn install

- compile

```bash
npx hardhat compile
```

- test

```bash
mpx hardhat test
```

```bash
yarn deploy
```

To run frontend, in the same project directory, run: 

```bash
cd frontend
```

```bash
yarn install
```

```bash
yarn run dev
```