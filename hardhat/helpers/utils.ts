import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BytesLike, Contract, ContractTransaction, Signer, Wallet } from 'ethers';
import { ensureDir } from 'fs-extra';
import { HardhatNetworkAccountConfig, HardhatNetworkAccountsConfig, HardhatNetworkConfig, HardhatRuntimeEnvironment } from 'hardhat/types';
import { join } from 'path';

export async function initEnv(hre: HardhatRuntimeEnvironment): Promise<SignerWithAddress[] | Wallet[]> {
  let network = getHardhatNetwork(hre);
  console.log(network)
  if (network == 'localhost') {
    const ethers = hre.ethers; // This allows us to access the hre (Hardhat runtime environment)'s injected ethers instance easily
    const accounts = await ethers.getSigners(); // This returns an array of the default signers connected to the hre's ethers instance
    const deployer = accounts[0];
    

    return [deployer];
  } else {
    const deployer_provider = hre.ethers.provider;
    const privKeyDEPLOYER = process.env['PK'] as BytesLike;
    const deployer_wallet = new Wallet(privKeyDEPLOYER);
    const deployer = await deployer_wallet.connect(deployer_provider) ;

    return [deployer];
  }
}

export async function getTimestamp(hre: HardhatRuntimeEnvironment): Promise<any> {
  const blockNumber = await hre.ethers.provider.send('eth_blockNumber', []);
  const block = await hre.ethers.provider.send('eth_getBlockByNumber', [blockNumber, false]);
  return block.timestamp;
}


export function getHardhatNetwork(hre: HardhatRuntimeEnvironment) {
  let network = hre.hardhatArguments.network;
  if (network == undefined) {
    network = hre.network.name;
  }
  return network;
}

export async function waitForTx(tx: Promise<ContractTransaction>) {
  await (await tx).wait();
}

export async function deployContract(tx: any): Promise<Contract> {
  const result = await tx;
  await result.deployTransaction.wait();
  return result;
}




export function getAssetsPath(contract_path_relative:string) {
const processDir = process.cwd()
const contract_path = join(processDir,contract_path_relative)
ensureDir(contract_path)
return contract_path
}


export async function impersonateAccount(hre:HardhatRuntimeEnvironment, account:string):Promise<Signer> {

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [account],
  });

  const signer = await hre.ethers.getSigner(account)
  return signer

}


export async function resertHardhat(hre:HardhatRuntimeEnvironment, ):Promise<void> {

  await hre.network.provider.request({
    method: "hardhat_reset",
    params: [],
  });

}


export async function forwardChainTime(hre:HardhatRuntimeEnvironment, INCREASE_PERIOD :number):Promise<void> {

  await hre.network.provider.send("evm_increaseTime", [INCREASE_PERIOD + 1])

}

export async function mineBlocks(hre:HardhatRuntimeEnvironment, nrOfBlocks:number) {
  for (let i = 1; i <= nrOfBlocks; i++) {
    await hre.network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
}

export async function setNextBlockTimestamp(hre: HardhatRuntimeEnvironment,timestamp: number): Promise<void> {
  await hre.ethers.provider.send('evm_setNextBlockTimestamp', [timestamp]);
}