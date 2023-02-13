import "./App.css";
import NavBar from "./components/NavBar";
import AppContainer from "./components/AppContainer";

import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import useTitle from "./hooks/useTitle";

function App() {
  const desiredChainId = ChainId.Polygon;
  useTitle("create-gasless-app");
  return (
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <div className="App bg-slate-600 h-screen flex flex-col content-center">
        <NavBar />
        <AppContainer />
      </div>
    </ThirdwebProvider>
  );
}

export default App;
