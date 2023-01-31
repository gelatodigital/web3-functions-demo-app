import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
