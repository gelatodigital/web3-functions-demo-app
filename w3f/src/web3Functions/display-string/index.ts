import { ethers} from "ethers";

import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";



import ky from "ky";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { storage, userArgs, gelatoArgs, provider, secrets } = context;

  ///// Gelato Arguments
  
  let blockTime = Math.floor(gelatoArgs.blockTime)
  let currentTime = new Date(gelatoArgs.blockTime*1000).toUTCString()
  

  //// User Arguments
  const contractAddress = userArgs.execAddress as string;

  ///// SECRETS////////
  // SECRETS_SENGRID_API ---> SENGRID_API - APIKEY
  // SECRETS_FROM_EMAIL ---> EMAIL - Address from send e mails
  // SECRETS_TO_EMAIL ---> EMAIL - Address to send e mails
  const apikey = (await secrets.get("SENGRID_API")) as string;
  const from = (await secrets.get("FROM_EMAIL")) as string;
  const to = (await secrets.get("TO_EMAIL")) as string;
 

  ///// State /////////
  let nrExecutions = parseInt((await storage.get("nrExecutions")) ?? "0");
  let lastBlockTimeExecution = parseInt((await storage.get("lastBlockTimeExecution")) ?? "0");

  let abi = [
    "function active() view returns (bool)",
    "function setMockString(string) external",
  ];

  let contract = new ethers.Contract(contractAddress, abi, provider);
  let active = await contract.active();

  if (!active) {
    return { canExec: false, message: "Contract not active" };
  }


  if (lastBlockTimeExecution + 160 > blockTime) {
    // We tell the executor that no transaction has to be executer
    return { canExec: false, message: `${lastBlockTimeExecution + 120 -blockTime} sec to next Execution, Executions: ${nrExecutions}` };
  } else {

    const randomQuoteApi = `https://zenquotes.io/api/random`;

    const quote: { q: string; a: string }[] = await ky
      .get(randomQuoteApi, { timeout: 5_000, retry: 0 })
      .json();
  
    let message = `${quote[0].a}: ${quote[0].q}`;
    console.log(message);


    nrExecutions = nrExecutions + 1;
    await storage.set("nrExecutions", nrExecutions.toString());
    await storage.set("lastBlockTimeExecution", blockTime.toString());
  
    await sendmail({ apikey, to, from, nrExecutions, time:currentTime });
  
  

    const tx = await contract.populateTransaction.setMockString(message);
    const data = tx.data as string;

    return { canExec: true, callData: data };
  }
});



export const sendmail = async (options: {
  apikey: string;
  from:string;
  to: string;
  nrExecutions: number;
  time:string
}): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const api = ky.extend({
        hooks: {
          beforeRequest: [
            (request) => {
              request.headers.set("Authorization", `Bearer ${options.apikey}`);
            },
          ],
        },
      });

      const response: any = await api
        .post("https://api.sendgrid.com/v3/mail/send ", {
          json: {
            personalizations: [{ to: [{ email: options.to }] }],
            from: { email: options.from},
            subject: `W3f Execution status ${options.time}`,
            content: [
              {
                type: "text/plain",
                value: `Current Executions ${options.nrExecutions}`,
              },
            ],
          },
        })
        .json();
   

      resolve(true);
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
};
