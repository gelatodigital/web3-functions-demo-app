import dotenv from "dotenv";
import { ethers } from "ethers";
import { GelatoOpsSDK } from "@gelatonetwork/ops-sdk";
import { Web3FunctionBuilder } from "@gelatonetwork/web3-functions-sdk/builder";
dotenv.config();

if (!process.env.PK) throw new Error("Missing env PRIVATE_KEY");
const pk = process.env.PK;

if (!process.env.PROVIDER_URL) throw new Error("Missing env PROVIDER_URL");
const providerUrl = process.env.PROVIDER_URL;

// Default Setting
const chainId = 80001;
const execAddress = "0xd321ed28472Bfe623B58810148888E5D30de7269";
const execAbi =[
  {
    inputs: [{ internalType: "string", name: "_string", type: "string" }],
    name: "setMockString",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
];

const main = async () => {
  // Instanciate provider & signer
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(pk as string, provider);
  const opsSdk = new GelatoOpsSDK(chainId, wallet);


  // Deploy Web3Function on IPFS
  console.log("Deploying Web3Function on IPFS...");
  const web3Function = "w3f/src/web3Functions/display-string/index.ts";
  const cid = await Web3FunctionBuilder.deploy(web3Function);
  console.log(`Web3Function IPFS CID: ${cid}`);





  // Create task using ops-sdk
  console.log("Creating automate task...");
  const execInterface = new ethers.utils.Interface(execAbi);

  const { taskId, tx } = await opsSdk.createTask({
    name: "Web3Function - Demo App",
    execAddress: execAddress,
    execSelector: execInterface.getSighash("setMockString"),
    dedicatedMsgSender: false,
    web3FunctionHash: cid,
    web3FunctionArgs: {
      execAddress: execAddress
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
