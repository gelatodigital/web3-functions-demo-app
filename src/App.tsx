import "./App.css";
import NavBar from "./components/NavBar";
import { resolve} from 'path';
import useTitle from "./hooks/useTitle";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PlaceHolderApp from "./components/apps/PlaceHolder";
import { StringDisplay } from "./blockchain/StringDisplay";
import StringMetadata from './blockchain/contracts/display-metadata.json'
import * as dotenv from 'dotenv';


function App() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(0);
  const [signer, setSigner] = useState<any>(null);
  const [stringDisplay, setStringDisplay] = useState<StringDisplay | null>(null);



  const connectButton = async () => {

    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
    const accounts = await provider.listAccounts()
    
    const { chainId } = await provider.getNetwork();
    const signer = await provider.getSigner()
    console.log(chainId)
   console.log(await accounts[0])
   console.log(await signer.getAddress());
  
   let contract = new ethers.Contract(StringMetadata.address,StringMetadata.abi,signer) as StringDisplay
   let string = await contract.display()
   console.log(string)
    return

    //  let ethereum = (window as any).ethereum;
    // if (!ethereum) {
    //   alert("Please install Metamask");
    // } else if (ethereum.isMetaMask) {
    //   const provider = new ethers.providers.Web3Provider(
    //     ethereum as any
    //   );
    //   const accounts = await provider.send("eth_requestAccounts", []);
    //   const { chainId } = await provider.getNetwork();
    //   let signer = await provider.getSigner()
    //   setSigner(signer)
    //   if (chainId !== 137) {
    //     alert("Please connect to Polygon");
    //   }

      
    //   setChainId(chainId);
    //   console.log(chainId);
    //   setConnected(true);
    //   console.log(connected);
    //   setAddress(accounts[0]);
    //   console.log(address);
   
    // }
  };


const getString = async( )=> {
  console.log(67, await signer.getAddress())
  if(stringDisplay!= undefined){
  console.log('display');
  }
  console.log(53)
  console.log(stringDisplay)
  let string = await stringDisplay!.display()
  console.log(string);
}

const getStringe = async (signer:any) =>{
  let contract = new ethers.Contract(StringMetadata.address,StringMetadata.abi,signer) as StringDisplay
  let string = await contract.display()

}

  useTitle("create-gelato-web3functions-dapp");
  useEffect(()=> {
    console.log('58')
    if(signer == null){
      return
    }
    console.log('66', StringMetadata.address)
 
    let contract = new ethers.Contract(StringMetadata.address,StringMetadata.abi,signer) as StringDisplay
    getStringe(signer)
    setStringDisplay(contract);
  },[signer])

  // useEffect(() => {
  //   getString()
  // },[stringDisplay]);

  return (
      <div className="App bg-slate-600 h-screen flex flex-col content-center">
        <NavBar
          connected={connected}
          address={address}
          connectButton={connectButton}
        />
        <PlaceHolderApp />
      </div>
  );
}

export default App;
