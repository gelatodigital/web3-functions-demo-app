# Gelato Web3 Functions Demo App using Hardhat & React

This  should help devs create web3 serverless functions easily, providing a hardhat instance, a basic react UI and the required infrastructure to get up and running.

This repo consists of the [wef3 functionstemplate](https://github.com/gelatodigital/web3-functions-template), a hardhat folder with a contract called StringDisplay.sol as well as a React minimal frontend .

The contract has a string variable that can be updated when the contract variable active is set to true.


&nbsp;

# 🏄‍♂️ Quick Start

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
