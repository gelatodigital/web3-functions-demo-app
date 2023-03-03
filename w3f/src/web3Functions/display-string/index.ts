import { ethers} from "ethers";

import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";



import ky from "ky";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { storage, userArgs, gelatoArgs, provider, secrets } = context;

  ///// Gelato Arguments
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

  let abi = [
    "function active() view returns (bool)",
    "function setMockString(string) external",
  ];

  let contract = new ethers.Contract(contractAddress, abi, provider);
  let active = await contract.active();

  if (!active) {
    return { canExec: false, message: "Contract not active" };
  }

  let randomApi = `http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100&count=1`;

  // we are using the lightweight ky library for doing the get request
  let randomApiRes: any = await ky.get(randomApi).json();

  if (!randomApiRes) throw Error("Get random number api failed");
  let random = randomApiRes[0] as number;

  if (random <= 75) {
    // We tell the executor that no transaction has to be executer
    return { canExec: false, message: `Number ${random}  <= 75, Executions: ${nrExecutions}` };
  } else {
    nrExecutions = nrExecutions + 1;
    await storage.set("nrExecutions", nrExecutions.toString());

    if (nrExecutions % 10 == 0) {
      await sendmail({ apikey, to, from, nrExecutions, time:currentTime });
    }

    let rString = randomString(10);
    const tx = await contract.populateTransaction.setMockString(rString);
    const data = tx.data as string;

    return { canExec: true, callData: data };
  }
});

const randomString = (length: number): string => {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const alphabet_length = alphabet.length - 1;
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const random_number = Math.floor(Math.random() * alphabet_length) + 1;
    randomString += alphabet[random_number];
  }
  return randomString;
};

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
