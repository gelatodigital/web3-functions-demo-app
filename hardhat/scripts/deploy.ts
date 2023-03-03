
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
  let provider =  hre.ethers.provider;
  console.log(deployer.address)
  console.log(await provider.getBalance(deployer.address))

  let nonce = await deployer.getTransactionCount();

  const stringDisplay = await new  StringDisplay__factory(deployer).deploy({gasLimit:1000000, gasPrice: 190000000000, nonce: 0});
  
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

