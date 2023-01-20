import React from "react";
import CounterRelayApp from "./apps/CounterRelayApp";
import DonateRelayApp from "./apps/DonateRelayApp";
import TestRelayApp from "./apps/TestRelayApp";

const AppContainer = () => {
  return (
    <div>
      <CounterRelayApp />
      <DonateRelayApp />
      <TestRelayApp />
    </div>
  );
};

export default AppContainer;
