import AddUser from "../contracts/AddUser.json"

// Ensure environment variables are loaded
// dotenv.config();

const contractABI = AddUser.abi;

export const getContractABI = () => {
  try {
    return contractABI;  // Simply return contractABI, not contractABI.abi
  } catch (error) {
    console.error('Error loading contract ABI:', error);
    return null;
  }
};

export const getContractConfig = () => {
  return {
    address: "0xBCa5F5AF659Bb62a6A8676fd445E8938e3f60272", // Hardcoded for now, could use environment variable
    abi: getContractABI(),
  };
};
