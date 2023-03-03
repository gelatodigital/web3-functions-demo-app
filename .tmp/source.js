// w3f/src/web3Functions/display-string/index.ts
import { ethers } from "ethers";
import {
  Web3Function
} from "@gelatonetwork/web3-functions-sdk";
import ky from "ky";
Web3Function.onRun(async (context) => {
  const { storage, userArgs, gelatoArgs, provider, secrets } = context;
  let currentTime = new Date(gelatoArgs.blockTime * 1e3).toUTCString();
  const contractAddress = userArgs.execAddress;
  const apikey = await secrets.get("SENGRID_API");
  const from = await secrets.get("FROM_EMAIL");
  const to = await secrets.get("TO_EMAIL");
  let nrExecutions = parseInt(await storage.get("nrExecutions") ?? "0");
  let abi = [
    "function active() view returns (bool)",
    "function setMockString(string) external"
  ];
  let contract = new ethers.Contract(contractAddress, abi, provider);
  let active = await contract.active();
  if (!active) {
    return { canExec: false, message: "Contract not active" };
  }
  let randomApi = `http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100&count=1`;
  let randomApiRes = await ky.get(randomApi).json();
  if (!randomApiRes)
    throw Error("Get random number api failed");
  let random = randomApiRes[0];
  if (random <= 75) {
    return { canExec: false, message: `Number ${random}  <= 75, Executions: ${nrExecutions}` };
  } else {
    nrExecutions = nrExecutions + 1;
    await storage.set("nrExecutions", nrExecutions.toString());
    if (nrExecutions % 10 == 0) {
      await sendmail({ apikey, to, from, nrExecutions, time: currentTime });
    }
    let rString = randomString(10);
    const tx = await contract.populateTransaction.setMockString(rString);
    const data = tx.data;
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
var sendmail = async (options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const api = ky.extend({
        hooks: {
          beforeRequest: [
            (request) => {
              request.headers.set("Authorization", `Bearer ${options.apikey}`);
            }
          ]
        }
      });
      const response = await api.post("https://api.sendgrid.com/v3/mail/send ", {
        json: {
          personalizations: [{ to: [{ email: options.to }] }],
          from: { email: options.from },
          subject: `W3f Execution status ${options.time}`,
          content: [
            {
              type: "text/plain",
              value: `Current Executions ${options.nrExecutions}`
            }
          ]
        }
      }).json();
      resolve(true);
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
};
export {
  sendmail
};
