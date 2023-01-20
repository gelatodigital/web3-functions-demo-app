// Package Imports
import React from "react";
import { ethers } from "ethers";
import { GelatoRelay } from "@gelatonetwork/relay-sdk";

// Local Imports
import donateABI from "../../assets/abi/DonateToVitalik.json";
import Vitalik from "../effects/DonatePopup"

import {
  useAddress,
  useContract,
  useChainId,
} from "@thirdweb-dev/react";

import { useEffect, useState } from "react";

const target = "0xb975E77F50c8a47a29de3C639d71705d4BbaB361"; // DonateToVitalik.sol
const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

const DonateRelayApp = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [taskState, setTaskState] = useState("N/A");
  const [timeToExecution, setTimeToExecution] = useState(0);
  const [vitalikBalance, setVitalikBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [wow, setWow] = useState(false);
  const address = useAddress();
  const chainId = useChainId();
  const { contract, isLoading } = useContract(target, donateABI.abi);

  //   const { mutate: increment } = useContractWrite(contract, "increment");

  //   console.log("address connected:" + address);
  //   console.log("chain id connected: " + chainId);

  // console.log("vitalik's balance: " + vitalikBalance);

  const sendRelayRequest = async () => {
    setButtonClicked(true);
    setWow(false);
    setTaskId(0);
    setStartTime(0);
    setTaskState("Loading...");
    const relay = new GelatoRelay();

    // relay request paramaters
    const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

    // connecting to contract through front-end provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(target, donateABI.abi, signer);

    // getting function selector
    const { data } = await contract.populateTransaction.sendToVitalik();

    const request = {
      chainId,
      target,
      data,
      feeToken,
      isRelayContext: true,
    };

    const relayResponse = await relay.callWithSyncFee(request);
    console.log(relayResponse.taskId);
    setTaskId(relayResponse.taskId);
    setStartTime(Date.now());
  };

  useEffect(() => {
    let intervalId;
    let timeoutId;
    if (taskId === 0) return;

    const getTaskState = async () => {
      try {
        const url = `https://relay.gelato.digital/tasks/status/${taskId}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        console.log(responseJson);
        setTaskState(responseJson.task.taskState);
      } catch (error) {
        console.error(error);
      }
    };

    const getVitaliksBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(
          ethers.utils.getAddress(vitalik)
        );
        const formattedBalance = ethers.utils.formatUnits(balance);
        const roundedBalance = Number(formattedBalance).toFixed(2);
        console.log("vitalik: " + roundedBalance);
        setVitalikBalance(roundedBalance);
      } catch (error) {
        console.error(error);
      }
    };

    console.log("taskId in useEffect:" + taskId);
    console.log("taskState in useEffect:" + taskState);

    if (taskState !== "ExecSuccess") {
      intervalId = setInterval(() => {
        getTaskState();
      }, 1500);
    } else {
      setTimeToExecution(Date.now() - startTime);
      setWow(true);
      setButtonClicked(false);
      getVitaliksBalance();
    }

    timeoutId = setTimeout(() => {
      setWow(false);
    }, "3000");

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [taskId, taskState, startTime, timeToExecution]);

  useEffect(() => {
    const getVitaliksBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(
          ethers.utils.getAddress(vitalik)
        );
        const formattedBalance = ethers.utils.formatUnits(balance);
        const roundedBalance = Number(formattedBalance).toFixed(2);
        console.log("vitalik: " + roundedBalance);
        setVitalikBalance(roundedBalance);
      } catch (error) {
        console.error(error);
      }
    };

    const getContractBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(
          ethers.utils.getAddress(target)
        );
        const formattedBalance = ethers.utils.formatUnits(balance);
        const roundedBalance = Number(formattedBalance).toFixed(2);
        setContractBalance(roundedBalance);
      } catch (error) {
        console.error(error);
      }
    };

    getContractBalance();
    getVitaliksBalance();
  }, [address, taskState, timeToExecution]);

  return (
    <div className="flex flex-row justify-center mt-5 mr-8 ml-8">
      <div className="card w-96 bg-base-100 shadow-xl basis-1/5">
        <div className="card-body">
          <div className="flex flex-row">
            <h2 className="card-title">Gasless Donation</h2>
          </div>
          <a
            href="https://mumbai.polygonscan.com/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045#internaltx"
            target="_blank"
            rel="noopener noreferrer"
            className="link self-start"
          >
            {" "}
            <p className="self-start mb-2"> Donation History </p>{" "}
          </a>
          <p className="self-start">
            Vitalik's Balance:{" "}
            <a
              href="https://mumbai.polygonscan.com/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {vitalikBalance}
            </a>{" "}
            MATIC
          </p>
          <p className="self-start mb-2">
            {" "}
            Faucet Balance:{" "}
            <a
              href="https://mumbai.polygonscan.com/address/0xb975E77F50c8a47a29de3C639d71705d4BbaB361"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {" "}
              {contractBalance}
            </a>{" "}
            MATIC
          </p>
          <div>
            <p>
              {" "}
              <b> {address ? "" : "Connect your wallet to begin"} </b>{" "}
            </p>
          </div>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" disabled={!address} onClick={sendRelayRequest}>
              {buttonClicked && taskState !== "ExecSuccess"
                ? "Gelato go brr"
                : "Donate"}
            </button>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 grow shadow-xl basis-1/5 ml-6">
        <div className="card-body">
          <div className="flex flex-col items-start space-y-2">
            <h2 className="card-title">Donation Status Poller</h2>
            <p>
              <b>Task ID:</b> 
              <a
                href={`https://relay.gelato.digital/tasks/status/${taskId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {taskId !== 0 ? taskId : "Waiting for Relay Request"}{" "}
              </a>
            </p>
            <p className="self-start">
              <b>Status:</b> {isLoading ? "Loading..." : taskState}
            </p>
            <p className="self-start">
              <b>Execution Time:</b>{" "}
              {buttonClicked ? "Calculating..." : timeToExecution / 1000 + "s"}
            </p>
          </div>
        </div>
        <div className="animate-pulse">{wow ? <Vitalik /> : ""}</div>
      </div>
    </div>
  );
};

export default DonateRelayApp;
