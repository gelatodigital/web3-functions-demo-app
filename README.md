# 🍦 Gelato Web3 Functions && 👷 Hardhat && React

This  should help devs create web3 serverless functions easily, providing a hardhat instance, a basic react UI and the required infrastructure to get up and running.

This repo consists of the [off-chain resolver template](https://github.com/gelatodigital/off-chain-resolver-template) and a hardhat folder with a contract called StringDisplay.sol as well as a React minimal frontend .

This contract locks an amount for one year. We have created a method called "unLock()" that will be called by Gelato OPS, when certain conditions off chain happen.



&nbsp;

# 🏄‍♂️ Quick Start

Add the env keys required

```bash
RPC=YOUR_PROVIDER_URL
PROVIDER_URL=YOUR_PROVIDER_URL
PK=YOUR PRIVATE KEY
MUMBAI_API_KEY=YOUR ETHERSCAN/POLYGON KEY
```

## Web3 functions

//TODO

## Contract Deployment


It is worth noticing that the difference between RPC and PROVIDER_URL. In the case that we are on testnet, the value will be the same, in the case that we are working on a forked network, the PROVIDER_URL eill be the localhost: `http://127.0.0.1:8545`

Change the values in .env-example file and rename it to .env
&nbsp;

### 2) : We open a separate terminal and create a local forked mumbai

```javascript
npm run fork
```

### 3) : We compile our contract

```javascript
npm run compile
```

### 4) : We deploy our contract

```javascript
npm run contract:deploy
```




## Test e2e 

At this point, we have all of our ingredients. On the one hand, we have a contract deployed to Goerli. Within the contract there is a method that will nb executed by Gelato ops; and on the other side, we have our assembly module deploy to ipfs (we can think as a kind of cloud function) that polywrap would help us withh it. ,,,,

before we run the test in file [LockResolver.ts](https://github.com/donoso-eth/off-chain/blob/master/hardhat/test/LockResolver.ts).


```javasript
npm run contracts:test
```
