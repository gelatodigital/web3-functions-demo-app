import "./App.css";
import NavBar from "./components/NavBar";
import { resolve } from "path";
import useTitle from "./hooks/useTitle";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PlaceHolderApp from "./components/apps/PlaceHolder";
import { StringDisplay } from "./blockchain/StringDisplay";
import StringMetadata from "./blockchain/contracts/display-metadata.json";
import * as dotenv from "dotenv";

function App() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [active, setActive] = useState(false);
  const [chainId, setChainId] = useState(0);
  const [signer, setSigner] = useState<any>(null);
  const [display, setDisplay] = useState<string>("");
  const [stringDisplay, setStringDisplay] = useState<StringDisplay | null>(
    null
  );

let network: 'mumbai' | 'localhost' = "mumbai"; // 'mumbai';// "localhost"; // 


 const initializeContract = async (signer:any) =>{
  let contract = new ethers.Contract(
    StringMetadata.address,
    StringMetadata.abi,
    signer
  ) as StringDisplay;
  let string = await contract.display();
  console.log(string)
  setStringDisplay(contract);
  setDisplay(string);
  setActive(await contract.active());
  console.log(string);
  setChainId(chainId);
  console.log(chainId);
  setConnected(true);
  console.log(connected);
  setAddress(await signer.getAddress());
  console.log(address);

  contract.on("NewString",async ()=> {
    console.log('chainging')
    let string = await contract.display();
    console.log(string)
    setDisplay(string);;
  })

 } 


  const toggleActive = async () => {
   
    let tx = await stringDisplay?.toggleChange();
    await tx?.wait();
    let new_active = await stringDisplay?.active();

   setActive(new_active!);
  };

  const connectButton = async () => {
    ////local
    if (network == "localhost") {
      const provider = new ethers.providers.JsonRpcProvider(
        "http://127.0.0.1:8545/"
      );
      const accounts = await provider.listAccounts();

      const { chainId } = await provider.getNetwork();
      const signer = await provider.getSigner();
      console.log(chainId);
      console.log(await accounts[0]);
      console.log(await signer.getAddress());
      initializeContract(signer)
      
    } else {
      //// wallet

      let ethereum = (window as any).ethereum;
      if (!ethereum) {
        alert("Please install Metamask");
      } else if (ethereum.isMetaMask) {
        const provider = new ethers.providers.Web3Provider(ethereum as any);
        const currentChainId = await ethereum.request({
          method: 'eth_chainId',
        });
    


        if (currentChainId !== "0x13881"){
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x13881"}],
          });
        }

        const accounts = await provider.send("eth_requestAccounts", []);
        const { chainId } = await provider.getNetwork();
        let signer = await provider.getSigner();
        setSigner(signer);
  
        initializeContract(signer)
    
      }
    }
  };

  const getString = async () => {
    let string = await stringDisplay!.display();
    console.log(string)
    setDisplay(string);;
  };



  useTitle("create-gelato-web3functions-dapp");


  return (
    <div className="App bg-slate-600 h-screen flex flex-col content-center">
      <NavBar
        connected={connected}
        address={address}
        connectButton={connectButton}
      />
      <PlaceHolderApp
        active={active}
        display={display}
        toggleActive={toggleActive}
      />
    </div>
  );
}

export default App;
