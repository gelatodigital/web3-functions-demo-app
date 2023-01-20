import React from "react";
import { ethers } from "ethers";
import counterABI from "../../assets/abi/SimpleCounter.json";
import { GelatoRelay, CallWithSyncFeeRequest } from "@gelatonetwork/relay-sdk";
import Wow from "../effects/CounterPopup";

import {
  useAddress,
  useContract,
  useContractRead,
  useChainId,
} from "@thirdweb-dev/react";

import { useEffect, useState } from "react";

const target = "0x730615186326cF8f03E34a2B49ed0f43A38c0603";

const CounterRelayApp = () => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const [task, setTask] = useState({id: "", status: "Waiting for Relay Request"});
  const [timer, setTimer] = useState({start: 0, execution: 0});
  const [wow, setWow] = useState(false);
  const address = useAddress();
  const chainId = useChainId();
  const { contract, isLoading } = useContract(target, counterABI.abi);
  const { data: counterValue } = useContractRead(contract, "counter");



  // const { mutate: increment } = useContractWrite(contract, "increment");

  const sendRelayRequest = async () => {
    setButtonClicked(true);
    setWow(false);
    setTimer({...timer, start: 0})

    const relay = new GelatoRelay();

    // relay request paramaters
    const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

    // connecting to contract through front-end provider
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(target, counterABI.abi, signer);

    // getting function selector
    const { data } = await contract.populateTransaction.increment();
  
    if (!chainId || !data) return; // error display

    const request: CallWithSyncFeeRequest = {
      chainId,
      target,
      data,
      feeToken,
      isRelayContext: true,
    };

    const relayResponse = await relay.callWithSyncFee(request);
    setTask({...task, id: relayResponse.taskId})
    setTimer({...timer, start: Date.now()});
  };

  useEffect(() => {
    let intervalId;
    let timeoutId;

    console.log("in CounterRelayApp useEffect");

    if (task.id === "") return;

    const getTaskState = async () => {
      try {
        const url = `https://relay.gelato.digital/tasks/status/${task.id}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        setTask({...task, status: responseJson.task.taskState});
      } catch (error) {
        console.error(error);
      }
    };

    if (task.status !== "ExecSuccess") {
      intervalId = setInterval(() => {
        getTaskState();
      }, 1500);
    } else {
      setTimer({...timer, execution: Date.now() - timer.start})
      setWow(true);
      setButtonClicked(false);
    }

    timeoutId = setTimeout(() => {
      setWow(false);
    }, 3000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [task, timer]);

  return (
    <div className="flex flex-row justify-center mt-5 mr-8 ml-8">
      <div className="card w-96 bg-base-100 shadow-xl basis-1/5">
        <div className="card-body">
          <div className="flex flex-col">
            <h2 className="card-title">Gasless Counter</h2>
          </div>
          <div className="mb-4 self-start">
            Current Counter Value:{" "}
            <a
              href="https://mumbai.polygonscan.com/address/0x730615186326cF8f03E34a2B49ed0f43A38c0603#readProxyContract"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {" "}
              {isLoading ? "Loading..." : counterValue?.toNumber()}{" "}
            </a>
          </div>
          <div>
            <p>
              {" "}
              <b> {address ? "" : "Connect your wallet to begin"} </b>{" "}
            </p>
          </div>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              disabled={!address}
              onClick={sendRelayRequest}
            >
              {buttonClicked && task.status !== "ExecSuccess"
                ? "Gelato go brr"
                : "Increment"}
            </button>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 grow shadow-xl basis-1/5 ml-6">
        <div className="card-body">
          <div className="flex flex-col items-start  space-y-2">
            <h2 className="card-title">Counter Status Poller</h2>
            <p className="break-words">
              <b>Task ID:</b>{" "}
              <a
                href={`https://relay.gelato.digital/tasks/status/${task.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {task.id !== "" ? task.id : "Waiting for Relay Request"}{" "}
              </a>
            </p>
            <p className="self-start">
              <b>Status:</b> {isLoading ? "Loading..." : task.status}
            </p>
            <p className="self-start">
              <b>Execution Time:</b>{" "}
              {buttonClicked ? "Calculating..." : timer.execution / 1000 + "s"}
            </p>
          </div>
        </div>
        <div className="animate-pulse">{wow ? <Wow /> : ""}</div>
      </div>
    </div>
  );
};

export default CounterRelayApp;
