import { useEffect, useState } from "react";

export default function useStatus() {
  const [status, setStatus] = useState("Waiting for Relay Request");

  // Spec: return status on status update

  // polling - status first class
  // finished - getDetails
  // popup

  useEffect(() => {
    let statusQuery: NodeJS.Timer;
    const getTaskState = async () => {
      try {
        const url = `https://relay.gelato.digital/tasks/status/${task.id}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        setStatus(responseJson.task.taskState);
      } catch (error) {
        console.error(error);
      }
    };

    if (status !== "ExecSuccess") {
      statusQuery = setInterval(() => {
        getTaskState();
      }, 1500);
      clearInterval(statusQuery);
    } else {
      // now the status is ExecSuccess
      return;
    }
  }, [status]);

  return [ status, setStatus ];
}
