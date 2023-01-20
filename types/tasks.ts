interface ITask {
  initiated: boolean;
  id: number;
  status: string;
  execSuccess: boolean;
  start: number;
  execution: number;
}

export { ITask };
