import { useState } from "react";

export default function useTestStatusPoller(taskId: string) {
  const [status, setStatus] = useState("");

  if (taskId === "") return;

  const getTaskState = async () => {
    try {
      const url = `https://relay.gelato.digital/tasks/status/${taskId}`;
      const response = await fetch(url);
      const responseJson = await response.json();
      setStatus(responseJson.task.taskState);
    } catch (error) {
      console.error(error);
    }
  };

  if (status !== "ExecSuccess") {
    getTaskState();
  } else {
    return status;
  }

  return status;
}
