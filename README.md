# Gelato Web3 Functions Demo App using Hardhat & React

This  should help devs create web3 serverless functions easily, providing a hardhat instance, a basic react UI and the required infrastructure to get up and running.

This repo consists of the [web3 functions template](https://github.com/gelatodigital/web3-functions-template), a hardhat folder with a contract called StringDisplay.sol as well as a minimal frontend written in React.

The contract has a string variable that can be updated when the contract variable `active` is set to true.

The contract is deployeed on mumbai [here](https://mumbai.polygonscan.com/address/0x67c982310a687e43ba2a659b1117f6c5b73bb662) and the current running task can be seen at: [task](https://beta.app.gelato.network/task/0x9d960c4ad76e1a0d9a5ae056fe5fd8186f3138c35ec3394f31ad61965428ac5b?chainId=80001)

The demo app is line under: [https://web3-functions-demo.gelato.network/](https://web3-functions-demo.gelato.network/)


&nbsp;

# 🏄‍♂️ Dev Quick Start

For local development please change network to "localhost" in `hardhat.config.ts` and in `App.tsx`

Add the env keys required

```bash
RPC=YOUR_PROVIDER_URL
PROVIDER_URL=YOUR_PROVIDER_URL
PK=YOUR PRIVATE KEY
MUMBAI_API_KEY=YOUR ETHERSCAN/POLYGON KEY
```
It is worth noticing that the difference between RPC and PROVIDER_URL. In the case that we are on testnet, the value will be the same, in the case that we are working on a forked network, the PROVIDER_URL eill be the localhost: `http://127.0.0.1:8545`

Change the values in .env-example file and rename it to .env
&nbsp;


## Web3 functions

### 1) index.ts
You can review the code of the funcion at the index.ts at `wrf/src/web3Functions/display-string/index.ts`


### 2) Test your web3 function
```javascript
npx w3f test wrf/src/web3Functions/display-string/index.ts  --show-logs
```

### 3) Deploy the web3 function
```javascript
npx w3f deploy wrf/src/web3Functions/display-string/index.ts
```
Deploying we will receive the CID.

```javascript
> npx w3f deploy wrf/src/web3Functions/display-string/index.ts

 ✓ Web3Function deployed to ipfs.
 ✓ CID: QmXqEvqQLzrQ1PcrR3ub2YqfHFqbHXrChusaGmtkTc2SMy
 ```

## Contract Deployment

### 1) : We open a separate terminal and create a local forked mumbai

```javascript
npm run fork
```

### 2) : We compile our contract

```javascript
npm run compile
```

### 3) : We deploy our contract

```javascript
npm run contract:deploy
```


## React Frontend
In a separate temrminal run followin command

```javascript
npm run start
```
