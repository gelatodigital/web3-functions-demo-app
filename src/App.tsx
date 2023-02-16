import "./App.css";
import NavBar from "./components/NavBar";

import useTitle from "./hooks/useTitle";
import { useState } from "react";
import { ethers } from "ethers";
import CounterRelayApp from "./components/apps/CounterRelayApp";

function App() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(0);

  const connectButton = async () => {

     let ethereum = (window as any).ethereum;
    if (!ethereum) {
      alert("Please install Metamask");
    } else if (ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(
        ethereum as any
      );
      const accounts = await provider.send("eth_requestAccounts", []);
      const { chainId } = await provider.getNetwork();

      if (chainId !== 137) {
        alert("Please connect to Polygon");
      }

      
      setChainId(chainId);
      console.log(chainId);
      setConnected(true);
      console.log(connected);
      setAddress(accounts[0]);
      console.log(address);
    }
  };

  useTitle("create-gasless-app");
  return (
      <div className="App bg-slate-600 h-screen flex flex-col content-center">
        <NavBar
          connected={connected}
          address={address}
          connectButton={connectButton}
        />
        <CounterRelayApp
          connected={connected}
          address={address}
          chainId={chainId}
        />
      </div>
  );
}

export default App;
