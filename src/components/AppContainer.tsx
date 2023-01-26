import React from "react";
import CounterRelayApp from "./apps/CounterRelayApp";
import GaslessNFTApp from "./apps/GaslessNFTApp";
// import DonateRelayApp from "./apps/DonateRelayApp";

const AppContainer = () => {
  return (
    <div>
      <CounterRelayApp />
      <GaslessNFTApp />
      {/* <DonateRelayApp /> */}
    </div>
  );
};

export default AppContainer;
