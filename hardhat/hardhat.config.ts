 import { HardhatUserConfig } from "hardhat/config";

import { resolve} from 'path';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import { existsSync } from "fs-extra";
import * as glob from 'glob';
import * as dotenv from 'dotenv';
dotenv.config();
require('dotenv').config({ path: resolve(__dirname, '../.env') })
const RPCURL  =  process.env["RPC"] as string;


if (existsSync('./typechain-types')) {
  glob.sync('./tasks/**/*.ts').forEach(function (file: any) {
    require(resolve(file));
  });
}//

let defaultNetwork = "mumbai";
// defaultNetwork = "localhost";
 defaultNetwork = "matic"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork,
  networks: {
    hardhat: {
      forking: {
        url: RPCURL
       // blockNumber: 7704180
      
      },
    },
    localhost: {
      url: 'http://localhost:8545',
      chainId: 31337,
    },
    matic: {
      url: 'https://polygon-rpc.com', //'https://polygon-mainnet.g.alchemy.com/v2/r6kvmGCX5T_vMG1vdQhuXBtHaOuZECdX',
  
      //https://polygon-rpc.com 0x5dcde0c1be6cdfacba8866e56182e66221c6eaf3f6a421bc58b6939d84e57b7b
      gasPrice: 1000000000,
          accounts:
        process.env['PK'] !== undefined
          ? [process.env['PK']]
          : [],
    },
    goerli: {
      url:RPCURL,
      gasPrice: 1000000000,
      accounts: [process.env["PK"] as string],
    },
    mumbai: {
      url:RPCURL,
      gasPrice: 1000000000,
      accounts: [process.env["PK"] as string],
    },
  },
  etherscan: {
     
     apiKey: { 
      polygon:process.env['MUMBAI_API_KEY']!,
      goerli: process.env['ETHERSCAN_API_KEY']!
     }
  },
};

export default config;
