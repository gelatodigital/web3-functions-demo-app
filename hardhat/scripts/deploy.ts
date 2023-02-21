import { ethers } from "hardhat";
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import { join} from 'path';
import {copyFileSync, writeFileSync,  ensureDirSync, copySync} from 'fs-extra'
import {StringDisplay__factory} from '../typechain-types/factories'
import { initEnv } from "../helpers/utils";
import * as hre from 'hardhat';
import { BigNumber } from "ethers";

const contract_path_relative = '../src/blockchain';
const processDir = process.cwd()
const contract_path = join(processDir,contract_path_relative)
ensureDirSync(contract_path)



async function main() {


  const [deployer] = await initEnv(hre);

  let nonce = await deployer.getTransactionCount();

  const stringDisplay = await new  StringDisplay__factory(deployer).deploy({gasLimit:10000000, nonce});
  
  let metadata = {
    address: stringDisplay.address,
    abi:StringDisplay__factory.abi
  }

  writeFileSync(join(contract_path,'contracts','display-metadata.json'),JSON.stringify(metadata));

  copySync(
    `./typechain-types/StringDisplay.ts`,
    join(contract_path,  `StringDisplay.ts`)
  );

  console.log(`StringDisplay Contract created at ${stringDisplay.address} `)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

