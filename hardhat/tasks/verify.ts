import { utils } from 'ethers';
import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { join } from 'path';


task('verify-contract', 'verify').setAction(async ({}, hre) => {

  await hre.run('verify:verify', {
    address: "0x902a666c5034970f67Ab3a97882e3CC797CbA783",
    constructorArguments: [ ],
  });
});
