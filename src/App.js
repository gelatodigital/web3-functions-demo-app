import "./App.css";
import NavBar from "./components/NavBar";
import Body from "./components/Body";

import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import useTitle from "./hooks/useTitle";

function App() {
  const desiredChainId = ChainId.Mumbai;
  useTitle("create-gasless-app");
  return (
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <div className="App bg-slate-600 h-screen flex flex-col content-center">
        <NavBar />
        <Body />
      </div>
    </ThirdwebProvider>
  );
}

export default App;
