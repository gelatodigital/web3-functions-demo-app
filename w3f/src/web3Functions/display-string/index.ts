import { BigNumber, Contract, ethers, providers } from "ethers";
import { Interface } from "ethers/lib/utils";
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";

import ky from "ky";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, provider } = context;

  let abi = [
    {
      inputs: [],
      name: "active",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "display",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "_string", type: "string" }],
      name: "setMockString",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "_string", type: "string" }],
      name: "setString",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    }
  ];
  let contractAddress = "0xeBbAcB67A6d09bA825dbFeAFd84187300Bc96867" //"0x67C982310a687e43bA2A659b1117f6c5B73bB662";

  let contract = new ethers.Contract(contractAddress, abi, provider);
  let active = await contract.active();

  if (!active) {
    return { canExec: false, message: "Contract not active" };
  }

  let randomApi = `http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100&count=1`;

  // we are using the lightweight ky library for doing the get request
  let randomApiRes: any = await ky.get(randomApi).json();

  if (!randomApiRes) throw Error("Get quote api failed");
  let random = randomApiRes[0] as number;

  if (random <= 75) {
    // We tell the executor that no transaction has to be executer
    return { canExec: false, message: "Number <= 75" };
  } else {
    let rString = randomString(10)
    const {data} = await contract.populateTransaction.setMockString(rString);

    return { canExec: true, callData: data! };
  }
});

const randomString = (length:number): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const alphabet_length = alphabet.length - 1;
  let randomString= "";
  for (let i = 0; i < length; i++) {
    const random_number = Math.floor(Math.random() * alphabet_length) + 1;
    randomString += alphabet[random_number];
  }
  return randomString
}