import { utils } from 'ethers';
import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { join } from 'path';


task('verify-contract', 'verify').setAction(async ({}, hre) => {

  await hre.run('verify:verify', {
    address: "0xC7c2E387610Ed960E6a09684fE340610e87F0810",
    constructorArguments: [ ],
  });
});
