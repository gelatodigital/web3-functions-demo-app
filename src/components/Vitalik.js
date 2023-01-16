import React from "react";
import vitalikGif from "../assets/vitalik.gif";

const Vitalik = () => {
  return (
    <div className="toast toast-end">
      <div className="alert alert-info">
        <div>
          <img src={vitalikGif} alt="wow" />
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

export default Vitalik;
