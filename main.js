const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const fundProjectABI = [
  {
    "inputs": [],
    "name": "addressToAmountFunded",
    "outputs": [
      {
        "internalType": "mapping(address => uint256)",
        "name": "",
        "type": "map"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "funders",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fund",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const fundProjectAddress = '0x1234567890123456789012345678901234567890';
const fundProjectContract = new web3.eth.Contract(fundProjectABI, fundProjectAddress);

const fund = async () => {
  const accounts = await web3.eth.getAccounts();
  await fundProjectContract.methods.fund().send({ from: accounts[0], value: 1 });
  console.log('Funded successfully');
};

const withdraw = async () => {
  const accounts = await web3.eth.getAccounts();

  // Resets map
  const funders = await fundProjectContract.methods.funders().call();
  for (let funderIndex = 0; funderIndex < funders.length; funderIndex++) {
    const funder = funders[funderIndex];
    await fundProjectContract.methods.addressToAmountFunded(funder).send({ from: accounts[0], value: 0 });
  }

  // Resets funders array
  await fundProjectContract.methods.funders().send({ from: accounts[0], value: 0 });

  await fundProjectContract.methods.withdraw().send({ from: accounts[0] });
  console.log('Withdrawn successfully');
};

fund();
withdraw();
