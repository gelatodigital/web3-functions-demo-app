// Package Imports
import React from "react";
import { ethers } from "ethers";
import { GelatoRelay, CallWithSyncFeeRequest } from "@gelatonetwork/relay-sdk";

// Local Imports
import donateABI from "../../assets/abi/DonateToVitalik.json";
import DonatePopup from '../effects/DonatePopup';

import {
  useAddress,
  useContract,
  useChainId,
} from "@thirdweb-dev/react";

import { useEffect, useState } from "react";

const target = "0xb975E77F50c8a47a29de3C639d71705d4BbaB361"; // DonateToVitalik.sol
const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

const DonateRelayApp = () => {
  // task state
  const [initiated, setInitiated] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [taskStatus, setTaskStatus] = useState("N/A");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // blockchain state 
  const [vitalikBalance, setVitalikBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);

  // misc state
  const [popup, setPopup] = useState(false);

  // thirdweb blockchain hooks
  const address = useAddress();
  const chainId = useChainId();
  const { isLoading } = useContract(target, donateABI.abi);

  //   const { mutate: increment } = useContractWrite(contract, "increment");

  const sendRelayRequest = async () => {
    // update state
    setInitiated(true);
    setPopup(false);
    setTaskId(0);
    setStartTime(0);
    setTaskStatus("Loading...");

    // instantiating Gelato Relay SDK
    const relay = new GelatoRelay();

    // connecting to contract through front-end provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(target, donateABI.abi, signer);

    // building relay request paramaters
    const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
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
    let statusQuery;
    let popupTimer;
    if (taskId === "") return;

    const getTaskState = async () => {
      try {
        const url = `https://relay.gelato.digital/tasks/status/${taskId}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        console.log(responseJson);
        setTaskStatus(responseJson.task.taskState);
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

    if (taskStatus !== "ExecSuccess") {
      statusQuery = setInterval(() => {
        getTaskState();
      }, 1500);
    } else {
      setEndTime(Date.now() - startTime);
      setPopup(true);
      setInitiated(false);
      getVitaliksBalance();
    }

    popupTimer = setTimeout(() => {
      setPopup(false);
    }, "3000");

    return () => {
      clearInterval(statusQuery);
      clearTimeout(popupTimer);
    };
  }, [taskId, taskStatus, startTime, endTime]);

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
  }, [address, taskStatus, endTime, popup]);

  return (
    <div className="flex flex-row justify-center mt-5 mr-8 ml-8">
      <div className="card w-96 bg-base-100 shadow-xl basis-1/5">
        <div className="card-body">
          <div className="flex flex-row">
            <h2 className="card-title">Gasless Donation</h2>
          </div>
          <a
            href={`https://mumbai.polygonscan.com/address/${target}#internaltx`}
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
              href={`https://mumbai.polygonscan.com/address/${vitalik}`}
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
              href={`https://mumbai.polygonscan.com/address/${target}`}
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
              <b> {address && chainId === 80001  ? "" : "Connect your wallet to Mumbai to begin"} </b>{" "}
            </p>
          </div>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" disabled={!(address && chainId === 80001)} onClick={sendRelayRequest}>
              {initiated && taskStatus !== "ExecSuccess"
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
              <b>Status:</b> {isLoading ? "Loading..." : taskStatus}
            </p>
            <p className="self-start">
              <b>Execution Time:</b>{" "}
              {initiated ? "Calculating..." : endTime / 1000 + "s"}
            </p>
          </div>
        </div>
        <div className="animate-pulse">{popup ? <DonatePopup /> : ""}</div>
      </div>
    </div>
  );
};

export default DonateRelayApp;
