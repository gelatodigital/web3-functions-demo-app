import React from "react";

import Popup from "../effects/Popup";

interface StatusPollerProps {
  title: string;
  isLoading: boolean;
  taskId: string;
  taskStatus: string;
  initiated: boolean;
  endTime: number;
  popup: boolean;
}

const StatusPoller = (props: StatusPollerProps) => {
  return (
    <div className="card w-96 bg-base-100 grow shadow-xl basis-1/5 ml-6">
      <div className="card-body">
        <div className="flex flex-col items-start  space-y-2">
          <h2 className="card-title">{props.title} Status Poller</h2>
          <p className="break-words">
            <b>Task ID:</b>{" "}
            <a
              href={`https://relay.gelato.digital/tasks/status/${props.taskId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              {props.taskId !== "" ? props.taskId : "Waiting for Relay Request"}{" "}
            </a>
          </p>
          <p className="self-start">
            <b>Status:</b> {props.isLoading ? "Loading..." : props.taskStatus}
          </p>
          <p className="self-start">
            <b>Execution Time:</b>{" "}
            {props.initiated ? "Calculating..." : props.endTime / 1000 + "s"}
          </p>
        </div>
      </div>
      <div className="animate-pulse">{props.popup ? <Popup /> : ""}</div>
    </div>
  );
};

export default StatusPoller;
