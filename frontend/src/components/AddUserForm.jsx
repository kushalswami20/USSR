import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getContractConfig } from '../utils/contract';
import Navbar from './shared/NavBar';

const AddUserForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    useraddress: '',
    name: '',
    datahash: ''
  });
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Upload the file to Pinata
  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
      },
    });

    const data = response.data;
    if (data.IpfsHash) {
      return data.IpfsHash;
    }
    throw new Error('Failed to upload image to Pinata');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      let dataHashFromIpfs = '';
      if (file) {
        dataHashFromIpfs = await uploadToPinata(file);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractConfig = getContractConfig();
      const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer);

      const tx = await contract.addUser(
        formData.useraddress,
        formData.name,
        dataHashFromIpfs
      );

      const receipt = await tx.wait();
      const event = receipt.events?.find((e) => e.event === 'userRecord');
      if (event) {
        setSuccess(`User added successfully! Transaction: ${receipt.transactionHash}`);
        alert("User added successfully");
        navigate("/");
      }

      setFormData({
        useraddress: '',
        name: '',
        datahash: ''
      });
      setFile(null);

    } catch (err) {
      setError(err.message || 'Error adding user');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConnect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setFormData((prev) => ({
        ...prev,
        useraddress: accounts[0],
      }));
    } catch (err) {
      setError('Error connecting to MetaMask');
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      {/* Header Section with Grid Pattern */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 mb-6 shadow-lg shadow-purple-500/30">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
              Add New User
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Register a new user with blockchain verification
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative group rounded-2xl overflow-hidden backdrop-blur-lg bg-white/5 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-500">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          
          <form onSubmit={handleSubmit} className="relative space-y-6 p-8">
            {/* User Address Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">User Address</label>
              <div className="flex gap-3">
                <Input
                  name="useraddress"
                  placeholder="0x..."
                  value={formData.useraddress}
                  onChange={handleChange}
                  className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  required
                />
                <Button
                  type="button"
                  onClick={handleConnect}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Connect
                </Button>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Name</label>
              <Input
                name="name"
                placeholder="Enter user name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                required
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Upload File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-xl hover:border-blue-500 transition-all duration-300 bg-gray-800/30">
                <div className="space-y-2 text-center">
                  <div className="flex text-sm text-gray-400">
                    <input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus:outline-none transition-colors duration-300"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="bg-red-900/50 border-red-800 text-red-300 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="bg-green-900/50 border-green-800 text-green-300 rounded-xl">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                'Add User'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
          background-size: 40px 40px;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddUserForm;