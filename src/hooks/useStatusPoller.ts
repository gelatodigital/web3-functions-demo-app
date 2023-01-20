import { useEffect, useState } from "react";

export default function useStatusPoller() {
  const [task, setTask] = useState({
    id: "",
    status: "Waiting for Relay Request",
    initiated: false,
    finished: false,
    startTime: 0,
    executionTime: 0,
    popupFlag: false,
  });

  // polling - status first class
  // finished - getDetails
  // popup

  let intervalId: NodeJS.Timer;
  let timeoutId: NodeJS.Timeout;

  console.log("useEffect starting...");

  if (task.id === "" || task.finished) return;
  // if there is a task ID continue

  const getTaskState = async () => {
    try {
      const url = `https://relay.gelato.digital/tasks/status/${task.id}`;
      const response = await fetch(url);
      const responseJson = await response.json();
      setTask({ ...task, status: responseJson.task.taskState });
    } catch (error) {
      console.error(error);
    }
  };

  if (task.status !== "ExecSuccess") {
    intervalId = setInterval(() => {
      getTaskState();
    }, 1500);
  } else {
    setTask({ ...task, finished: true, popupFlag: true });
    timeoutId = setTimeout(() => {
      setTask({ ...task, popupFlag: false });
    }, 3000);

    clearTimeout(timeoutId);
  }

  clearInterval(intervalId);

  setTask({
    ...task,
    executionTime: Date.now() - task.startTime,
    popupFlag: true,
    initiated: true,
  });

  return status;
}
