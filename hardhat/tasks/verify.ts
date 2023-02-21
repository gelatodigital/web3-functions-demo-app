import { utils } from 'ethers';
import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { join } from 'path';


task('verify-contract', 'verify').setAction(async ({}, hre) => {

  await hre.run('verify:verify', {
    address: "0x67C982310a687e43bA2A659b1117f6c5B73bB662",
    constructorArguments: [ ],
  });
});
