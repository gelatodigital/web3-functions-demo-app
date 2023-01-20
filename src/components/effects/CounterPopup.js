import React from "react";
import wowGif from "../../assets/images/wow.gif";

const CounterPopup = () => {
  return (
    <div className="toast toast-end">
      <div className="alert alert-info">
        <div>
          <img src={wowGif} alt="wow" />
        </div>
      </div>
      <div className="alert alert-success">
        <div>
          <span>Relay Request Executed Successfully</span>
        </div>
      </div>
    </div>
  );
};

export default CounterPopup;
