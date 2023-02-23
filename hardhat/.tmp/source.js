// ../w3f/src/web3Functions/display-string/index.ts
import { ethers } from "ethers";
import {
  Web3Function
} from "@gelatonetwork/web3-functions-sdk";
import ky from "ky";
Web3Function.onRun(async (context) => {
  const { userArgs, gelatoArgs, provider } = context;
  let abi = [
    {
      inputs: [],
      name: "active",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "display",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "string", name: "_string", type: "string" }],
      name: "setMockString",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ internalType: "string", name: "_string", type: "string" }],
      name: "setString",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ];
  let contractAddress = "0xd321ed28472Bfe623B58810148888E5D30de7269";
  let contract = new ethers.Contract(contractAddress, abi, provider);
  let active = await contract.active();
  if (!active) {
    return { canExec: false, message: "Contract not active" };
  }
  let randomApi = `http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100&count=1`;
  let randomApiRes = await ky.get(randomApi).json();
  if (!randomApiRes)
    throw Error("Get quote api failed");
  let random = randomApiRes[0];
  if (random <= 75) {
    return { canExec: false, message: "Number <= 75" };
  } else {
    let rString = randomString(10);
    const { data } = await contract.populateTransaction.setMockString(rString);
    return { canExec: true, callData: data };
  }
});
var randomString = (length) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const alphabet_length = alphabet.length - 1;
  let randomString2 = "";
  for (let i = 0; i < length; i++) {
    const random_number = Math.floor(Math.random() * alphabet_length) + 1;
    randomString2 += alphabet[random_number];
  }
  return randomString2;
};
