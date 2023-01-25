import React from "react";
import CounterRelayApp from "./apps/CounterRelayApp";
import DonateRelayApp from "./apps/DonateRelayApp";

const AppContainer = () => {
  return (
    <div>
      <CounterRelayApp />
      <DonateRelayApp />
    </div>
  );
};

export default AppContainer;
