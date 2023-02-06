import stickman from "../../assets/images/stickman.gif";

const Popup = () => {
  return (
    <div className="toast toast-end">
      <div className="alert alert-success">
        <div className="flex flex-row">
          <span>Relay Request Executed Successfully</span>
          <img src={stickman} width={40} height={40} alt="get that groove on" />
        </div>
      </div>
    </div>
  );
};

export default Popup;
