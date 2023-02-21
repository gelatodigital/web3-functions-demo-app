import dotenv from "dotenv";
import { ethers } from "ethers";
import { GelatoOpsSDK } from "@gelatonetwork/ops-sdk";
import { Web3FunctionBuilder } from "@gelatonetwork/web3-functions-sdk/builder";
dotenv.config();

if (!process.env.PRIVATE_KEY) throw new Error("Missing env PRIVATE_KEY");
const pk = process.env.PRIVATE_KEY;

if (!process.env.PROVIDER_URL) throw new Error("Missing env PROVIDER_URL");
const providerUrl = process.env.PROVIDER_URL;

// Default Setting
const chainId = 42161;
const execAddress = "0xf9cE23237B25E81963b500781FA15d6D38A0DE62";
const execAbi = [
  "function run(uint256,bytes) external"
];

const main = async () => {
  // Instanciate provider & signer
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(pk as string, provider);
  const opsSdk = new GelatoOpsSDK(chainId, wallet);

  // Deploy Web3Function on IPFS
  console.log("Deploying Web3Function on IPFS...");
  const web3Function = "./src/web3Functions/gmx-strategy/index.ts";
  const cid = await Web3FunctionBuilder.deploy(web3Function);
  console.log(`Web3Function IPFS CID: ${cid}`);

  // Create task using ops-sdk
  console.log("Creating automate task...");
  const execInterface = new ethers.utils.Interface(execAbi);
  const { taskId, tx } = await opsSdk.createTask({
    name: "Web3Function - Abracadabra Gmx-Strategy",
    execAddress: execAddress,
    execSelector: execInterface.getSighash("run"),
    dedicatedMsgSender: true,
    web3FunctionHash: cid,
    web3FunctionArgs: {
      execAddress: "0xf9cE23237B25E81963b500781FA15d6D38A0DE62",
      zeroExApiBaseUrl: "https://arbitrum.api.0x.org",
      intervalInSeconds: "86400",
      rewardSwappingSlippageInBips: "100",
    },
  });
  await tx.wait();
  console.log(`Task created, taskId: ${taskId} (tx hash: ${tx.hash})`);
  console.log(
    `> https://beta.app.gelato.network/task/${taskId}?chainId=${chainId}`
  );
};

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
