import { ethers } from 'ethers';
import contractAbi from '../contract-abi.json';
import contractAddress from '../contract-address.json';

let provider;
let signer;
let contract;

if (window.ethereum) {
  provider = new ethers.BrowserProvider(window.ethereum);
} else {
  console.error("Please install MetaMask!");
  // Fallback to a read-only provider if MetaMask is not available
  provider = ethers.getDefaultProvider('http://localhost:8545');
}

const getSigner = async () => {
  if (!signer && window.ethereum) {
    signer = await provider.getSigner();
  }
  return signer;
};

const getContract = async (withSigner = false) => {
  if (!contract) {
    const currentSigner = withSigner ? await getSigner() : provider;
    contract = new ethers.Contract(contractAddress.address, contractAbi, currentSigner);
  }
  if (withSigner && contract.runner !== signer) {
    const currentSigner = await getSigner();
    contract = contract.connect(currentSigner);
  }
  return contract;
};

export { provider, getSigner, getContract };
