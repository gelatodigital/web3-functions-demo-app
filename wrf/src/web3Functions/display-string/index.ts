import { BigNumber, Contract, ethers, providers } from "ethers";
import { Interface } from "ethers/lib/utils";
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";

import ky from "ky";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, provider } = context;


  let randomApi = `http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100&count=1`;

  // we are using the lightweight ky library for doing the get request
  let randomApiRes: any = await ky.get(randomApi).json();


  if (!randomApiRes) throw Error("Get quote api failed");
  let random = randomApiRes[0] as number;

  if (random > 75) {
    // We tell the executor that no transaction has to be executer
    return { canExec: false, message: "" };

  } else {
    // We send to the executor the payload to be  executed
    const iface = new Interface(["function increaseCounter()"])
    let callData = iface.encodeFunctionData("increaseCounter")

    return { canExec: true, callData:callData};
  }


});

