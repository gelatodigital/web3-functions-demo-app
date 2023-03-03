import { utils } from 'ethers';
import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { join } from 'path';


task('verify-contract', 'verify').setAction(async ({}, hre) => {

  await hre.run('verify:verify', {
    address: "0x054FA50FcC3E33465A72405229771d5deAA09Ab3",
    constructorArguments: [ ],
  });
});
