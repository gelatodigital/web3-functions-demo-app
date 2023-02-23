import { join } from "path";
import dotenv from "dotenv";
import {
  Secrets,
  GelatoOpsModule
} from "@gelatonetwork/ops-sdk";
dotenv.config();
import * as hre from "hardhat";
import { BigNumber, Contract, providers } from "ethers";
import { Web3FunctionRunner } from "@gelatonetwork/web3-functions-sdk/runtime";
import { Web3FunctionBuilder } from "@gelatonetwork/web3-functions-sdk/builder";
import { ops_abi } from "../helpers/abi";

if (!process.env.PK) throw new Error("Missing env PRIVATE_KEY");
const pk = process.env.PK;

if (!process.env.PROVIDER_URL) throw new Error("Missing env PROVIDER_URL");
const providerUrl = process.env.PROVIDER_URL;

export const runWeb3Function = async () => {
  const contract_path_relative =
    "../w3f/src/web3Functions/display-string/index.ts";
  const processDir = process.cwd();
  let web3FunctionPath = join(processDir, contract_path_relative);

  let execAddress = "0xd321ed28472Bfe623B58810148888E5D30de7269";

  let GelatoNetworkMumbai = "0x25aD59adbe00C2d80c86d01e2E05e1294DA84823";

  //// Impersonating executor
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [GelatoNetworkMumbai],
  });

  let executor = await hre.ethers.provider.getSigner(GelatoNetworkMumbai);


  ///// Build the web3function
  let provider = new hre.ethers.providers.JsonRpcProvider(providerUrl);
  const wallet = new hre.ethers.Wallet(pk as string, provider);

  const buildRes = await Web3FunctionBuilder.build(web3FunctionPath, false);

  if (!buildRes.success)
    throw new Error(`Fail to build web3Function: ${buildRes.error}`);

  const secrets = await fillSecrets();
  let context = {
    secrets,
    storage: {},
    gelatoArgs: {
      chainId: 80001,
      blockTime: Math.floor(Date.now() / 1000),
      gasPrice: "10",
    },
    userArgs: {
      execAddress: execAddress,
    },
  };

  const runner = new Web3FunctionRunner(false);
  const runtime: "docker" | "thread" = "thread";
  const memory = buildRes.schema.memory;
  const rpcLimit = 100;
  const timeout = buildRes.schema.timeout * 1000;

  const options = {
    runtime,
    showLogs: true,
    memory,
    rpcLimit,
    timeout,
  };
  const script = buildRes.filePath;

  if (!provider) {
    if (!process.env.PROVIDER_URL) {
      console.error(`Missing PROVIDER_URL in .env file`);
      process.exit();
    }

    provider = new hre.ethers.providers.StaticJsonRpcProvider(
      process.env.PROVIDER_URL
    );
  }

  ///// Calling the web3 Funcion
  const res = await runner.run({ script, context, options, provider });

  if (res.success == true) {
    let result = res.result;
    if (result.canExec == true) {


      //// If the w3f return success we prepare the module data for the task
      const modules: number[] = [];
      const args: string[] = [];

      let web3FunctionHash = "Qme1qm99MJAVWLnmFv8DzRmSh2iN8qZ5xTf1Md1mTNn6dq";
      let web3FunctionArgs = {
        execAddress: execAddress,
      };

      const opsModules = new GelatoOpsModule();


      modules.push(4);
      args.push(
        await opsModules.encodeWeb3FunctionArgs(web3FunctionHash, web3FunctionArgs)
      );

      let moduleData = {
        modules,
        args,
      };

      const sponsor = "0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581";
      const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
      const feeToken = ETH;
      const oneBalanceChainId = 1;
      const nativeToFeeTokenXRateNumerator = 1;
      const nativeToFeeTokenXRateDenominator = 1;
      const correlationId = hre.ethers.constants.HashZero;

      const gelato1BalanceParam = {
        sponsor,
        feeToken,
        oneBalanceChainId,
        nativeToFeeTokenXRateNumerator,
        nativeToFeeTokenXRateDenominator,
        correlationId,
      };

      /// we instantiate the OPs contract
      let ops = new Contract(
        "0x2A6C106ae13B558BB9E2Ec64Bd2f1f7BEFF3A5E0",
        ops_abi ,
        executor
      );

      /// we execute the calldata using the exec1Balance`
      let tx = await ops
        .connect(executor)
        .exec1Balance(
          wallet.address,
          execAddress,
          result.callData,
          moduleData,
          gelato1BalanceParam,
          true
        );

      await tx.wait();
    }
  }

  return res;
};
runWeb3Function()
  .then((x) => console.log(x))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

///// HELPER FUNCTIONS

const fillSecrets = async () => {
  let secrets: Secrets = {};

  // Fill up secrets with `SECRETS_*` env
  Object.keys(process.env)
    .filter((key) => key.startsWith("SECRETS_"))
    .forEach((key) => {
      const secret = process.env[key] as string;
      secrets = {
        ...secrets,
        [key.replace("SECRETS_", "")]: secret,
      };
    });

  return secrets;
};
