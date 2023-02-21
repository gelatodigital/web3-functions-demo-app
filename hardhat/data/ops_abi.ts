export const ops_abi =  [
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "taskId",
          type: "bytes32",
        },
      ],
      name: "cancelTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "execAddress",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "execData",
          type: "bytes",
        },
        {
          components: [
            {
              internalType: "enum LibDataTypes.Module[]",
              name: "modules",
              type: "uint8[]",
            },
            {
              internalType: "bytes[]",
              name: "args",
              type: "bytes[]",
            },
          ],
          internalType: "struct LibDataTypes.ModuleData",
          name: "moduleData",
          type: "tuple",
        },
        {
          internalType: "address",
          name: "feeToken",
          type: "address",
        },
      ],
      name: "createTask",
      outputs: [
        {
          internalType: "bytes32",
          name: "taskId",
          type: "bytes32",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "taskCreator",
          type: "address",
        },
        {
          internalType: "address",
          name: "execAddress",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "execData",
          type: "bytes",
        },
        {
          components: [
            {
              internalType: "enum LibDataTypes.Module[]",
              name: "modules",
              type: "uint8[]",
            },
            {
              internalType: "bytes[]",
              name: "args",
              type: "bytes[]",
            },
          ],
          internalType: "struct LibDataTypes.ModuleData",
          name: "moduleData",
          type: "tuple",
        },
        {
          internalType: "uint256",
          name: "txFee",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "feeToken",
          type: "address",
        },
        {
          internalType: "bool",
          name: "useTaskTreasuryFunds",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "revertOnFailure",
          type: "bool",
        },
      ],
      name: "exec",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getFeeDetails",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "taskCreator",
          type: "address",
        },
      ],
      name: "getTaskIdsByUser",
      outputs: [
        {
          internalType: "bytes32[]",
          name: "",
          type: "bytes32[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "enum LibDataTypes.Module[]",
          name: "modules",
          type: "uint8[]",
        },
        {
          internalType: "address[]",
          name: "moduleAddresses",
          type: "address[]",
        },
      ],
      name: "setModule",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "taskTreasury",
      outputs: [
        {
          internalType: "contract ITaskTreasuryUpgradable",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];