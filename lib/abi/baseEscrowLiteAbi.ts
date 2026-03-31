export const baseEscrowLiteAbi = [
  {
    type: "function",
    name: "createDeal",
    stateMutability: "payable",
    inputs: [{ name: "seller", type: "address" }],
    outputs: []
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "dealCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    type: "function",
    name: "deals",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "buyer", type: "address" },
      { name: "seller", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "approved", type: "bool" }
    ]
  },
  {
    type: "event",
    name: "Created",
    inputs: [
      { indexed: false, name: "id", type: "uint256" },
      { indexed: false, name: "buyer", type: "address" },
      { indexed: false, name: "seller", type: "address" },
      { indexed: false, name: "amount", type: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Approved",
    inputs: [{ indexed: false, name: "id", type: "uint256" }],
    anonymous: false
  }
] as const;