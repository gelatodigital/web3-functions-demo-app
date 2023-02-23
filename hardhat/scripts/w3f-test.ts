import { join } from "path";
import dotenv from "dotenv";
import {
  Secrets,
  Web3FunctionDownloader,
  Web3FunctionUserArgsSchema,
} from "@gelatonetwork/ops-sdk";
dotenv.config();
import * as hre from "hardhat";
import { BigNumber, Contract, providers } from "ethers";
import { Web3FunctionContextData } from "@gelatonetwork/web3-functions-sdk";
import { Web3FunctionRunner } from "@gelatonetwork/web3-functions-sdk/runtime";
import { Web3FunctionBuilder } from "@gelatonetwork/web3-functions-sdk/builder";

if (!process.env.PK) throw new Error("Missing env PRIVATE_KEY");
const pk = process.env.PK;

if (!process.env.PROVIDER_URL) throw new Error("Missing env PROVIDER_URL");
const providerUrl = process.env.PROVIDER_URL;

export const runWeb3Function = async () => {
  const contract_path_relative =
    "../w3f/src/web3Functions/display-string/index.ts";
  const processDir = process.cwd();
  let web3FunctionPath = join(processDir, contract_path_relative);

  let execAddress = "0xeBbAcB67A6d09bA825dbFeAFd84187300Bc96867";

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

      let web3FunctionHash = "QmYSzjyfzoumDTUHRsUV6eXsnGpVKVnnqDK3NhdvHuzBfK";
      let web3FunctionArgs = {
        execAddress: execAddress,
      };

      modules.push(4);
      args.push(
        await encodeWeb3FunctionArgs(web3FunctionHash, web3FunctionArgs)
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
        [
          {
            inputs: [
              {
                internalType: "address",
                name: "_taskCreator",
                type: "address",
              },
              {
                internalType: "address",
                name: "_execAddress",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_execData",
                type: "bytes",
              },
              {
                components: [
                  {
                    internalType: "enum LibDataTypes.Module[]",
                    name: "modules",
                    type: "uint8[]",
                  },
                  {
                    internalType: "bytes[]",
                    name: "args",
                    type: "bytes[]",
                  },
                ],
                internalType: "struct LibDataTypes.ModuleData",
                name: "_moduleData",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "sponsor",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "feeToken",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "oneBalanceChainId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "nativeToFeeTokenXRateNumerator",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "nativeToFeeTokenXRateDenominator",
                    type: "uint256",
                  },
                  {
                    internalType: "bytes32",
                    name: "correlationId",
                    type: "bytes32",
                  },
                ],
                internalType: "struct IGelato1Balance.Gelato1BalanceParam",
                name: "_oneBalanceParam",
                type: "tuple",
              },
              {
                internalType: "bool",
                name: "_revertOnFailure",
                type: "bool",
              },
            ],
            name: "exec1Balance",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
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

const encodeWeb3FunctionArgs = async (
  web3FunctionHash: string,
  web3FunctionArgs?: Web3FunctionUserArgs,
  web3FunctionArgsHex?: string
): Promise<string> => {
  try {
    if (!web3FunctionArgsHex && web3FunctionArgs) {
      const { types, keys } = await getAbiTypesAndKeysFromSchema(
        web3FunctionHash
      );
      // ensure all userArgs are provided & encoded in same order as they are defined in the schema
      const values: (
        | string
        | boolean
        | number
        | string[]
        | boolean[]
        | number[]
      )[] = [];
      for (const key of keys) {
        if (typeof web3FunctionArgs[key] === "undefined") {
          throw new Error(
            `Missing user arg '${key}' defined in resolver schema`
          );
        }
        values.push(web3FunctionArgs[key]);
      }

      web3FunctionArgsHex = hre.ethers.utils.defaultAbiCoder.encode(
        types,
        values
      );
    }

    const encoded = hre.ethers.utils.defaultAbiCoder.encode(
      ["string", "bytes"],
      [web3FunctionHash, web3FunctionArgsHex]
    );

    return encoded;
  } catch (err) {
    throw new Error(`Fail to encode Web3Function: ${err.message}`);
  }
};

const getAbiTypesAndKeysFromSchema = async (
  web3FunctionHash?: string,
  _userArgsSchema?: Web3FunctionUserArgsSchema
): Promise<{ keys: string[]; types: string[] }> => {
  try {
    let userArgsSchema = _userArgsSchema;

    if (!userArgsSchema) {
      if (web3FunctionHash) {
        const downloader = new Web3FunctionDownloader();
        const schema = await downloader.fetchSchema(web3FunctionHash);
        userArgsSchema = schema.userArgs;
      } else
        throw new Error(`Both userArgsSchema && web3FunctionHash undefined`);
    }

    const types: string[] = [];
    const keys: string[] = [];

    Object.keys(userArgsSchema).forEach((key) => {
      if (!userArgsSchema || !userArgsSchema[key]) return;
      keys.push(key);
      const value = userArgsSchema[key];
      switch (value) {
        case "number":
          types.push("uint256");
          break;
        case "string":
          types.push("string");
          break;
        case "boolean":
          types.push("bool");
          break;
        case "number[]":
          types.push("uint256[]");
          break;
        case "string[]":
          types.push("string[]");
          break;
        case "boolean[]":
          types.push("bool[]");
          break;
        default:
          throw new Error(
            `Invalid schema in web3Function CID: ${web3FunctionHash}. Invalid type ${value}. userArgsSchema: ${userArgsSchema}`
          );
      }
    });

    return { types, keys };
  } catch (err) {
    throw new Error(`Fail to get types from schema: ${err.message}`);
  }
};

interface Web3FunctionUserArgs {
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
}
