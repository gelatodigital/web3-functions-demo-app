# Gelato Web3 Functions Demo App using Hardhat & React

This  should help devs create web3 serverless functions easily, providing a hardhat instance, a basic react UI and the required infrastructure to get up and running.

This repo consists of the [web3 functions template](https://github.com/gelatodigital/web3-functions-template), a hardhat folder with a contract called StringDisplay.sol as well as a minimal frontend written in React.

The contract has a string variable that can be updated when the contract variable `active` is set to true.

The contract is deployeed on  polygon [here](https://polygonscan.com/address/0x054FA50FcC3E33465A72405229771d5deAA09Ab3) and the current running task can be seen at: [task](https://beta.app.gelato.network/task/0x3fa2ac06fdfb3c5fbe02c31e05cbf11bc659f2f710f11c3ee53ef3c3defe99d8?chainId=137)

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
You can review the code of the funcion at the index.ts at `w3f/src/web3Functions/display-string/index.ts`


### 2) Test your web3 function
```javascript
npx w3f test w3f/src/web3Functions/display-string/index.ts  --show-logs
```

### 3) Deploy the web3 function
```javascript
npx w3f deploy w3f/src/web3Functions/display-string/index.ts
```
Deploying we will receive the CID.

```javascript
> npx w3f deploy w3f/src/web3Functions/display-string/index.ts

 ✓ Web3Function deployed to ipfs.
 ✓ CID: QmXqEvqQLzrQ1PcrR3ub2YqfHFqbHXrChusaGmtkTc2SMy
 ```

If we want to create a task and test in forked network we would have now to fork and deploy our contracts.
### 4) Create your task
We can create our task programatically as we can see at the [create-task.ts](https://github.com/gelatodigital/web3-functions-demo-app/blob/master/w3f/src/scripts/create-task.ts)
As we are working in a local forked network we don't need get whitelisted to cr4eate the task.

We have a command to create the task
```javascript
npm run create-task
```

### 5) Test the execution of your Web3 Funcition on a forked network
Please install the deno package into the hardhat folder with:
```javascript
npm i install-deno
```
We have created out test execution at [w3f-test.ts](https://github.com/gelatodigital/web3-functions-demo-app/blob/master/hardhat/scripts/w3f-test.ts)

This script does following steps:

1) Impersoante Ops Executor
2) Build the Web3 Function
3) Run the Web3 Function
4) If run returns canExec = false --> do nothing
5) if canExec=true

    5.1) create module data for the task

    5.2) Create instance of ops contract on mumbai

    5.3) Execute the task through the ops contract with `exec1Balance()`method 

In order to run the script we will use 

```javascript
npm run w3f:test-harhat
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
