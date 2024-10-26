import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, User, Clock, Hash, Wallet, IdCard, ExternalLink } from 'lucide-react';
import { getContractConfig } from '../utils/contract';
import Navbar from './shared/NavBar';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractConfig = getContractConfig();
      const contract = new ethers.Contract(
        contractConfig.address,
        contractConfig.abi,
        provider
      );

      const data = await contract.getUserData(userId);
      setUserData({
        id: data[0].toString(),
        useraddress: data[1],
        timestamp: new Date(data[2].toNumber() * 1000).toLocaleString(),
        name: data[3],
        datahash: data[4]
      });
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error fetching user data');
      setLoading(false);
    }
  };

  const navigateUser = (direction) => {
    setUserId(prev => Math.max(1, direction === 'next' ? prev + 1 : prev - 1));
    setLoading(true);
  };

  // Function to format IPFS hash into a gateway URL
  const getIPFSLink = (hash) => {
    // Remove 'ipfs://' prefix if it exists
    const cleanHash = hash.replace(/^ipfs:\/\//, '');
    // Use public IPFS gateway
    return `https://ipfs.io/ipfs/${cleanHash}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 mb-6 shadow-lg shadow-purple-500/30">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
              User Profile
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Detailed information about the blockchain user
            </p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-10">
            {error}
          </div>
        ) : userData && (
          <div className="animate-slide-up">
            {/* Navigation Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                onClick={() => navigateUser('prev')}
                disabled={userId <= 1}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Previous User
              </Button>
              <Button
                onClick={() => navigateUser('next')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Next User
              </Button>
            </div>

            {/* Profile Card */}
            <div className="relative group rounded-2xl overflow-hidden backdrop-blur-lg bg-white/5 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-500">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              
              <div className="relative p-8 space-y-6">
                {/* User Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID */}
                  <div className="bg-gray-800/50 rounded-xl p-6 transform transition-transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-2">
                      <IdCard className="h-5 w-5 text-blue-400" />
                      <h3 className="text-gray-300 font-medium">User ID</h3>
                    </div>
                    <p className="text-white text-lg font-semibold">{userData.id}</p>
                  </div>

                  {/* Name */}
                  <div className="bg-gray-800/50 rounded-xl p-6 transform transition-transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5 text-purple-400" />
                      <h3 className="text-gray-300 font-medium">Name</h3>
                    </div>
                    <p className="text-white text-lg font-semibold">{userData.name}</p>
                  </div>

                  {/* Timestamp */}
                  <div className="bg-gray-800/50 rounded-xl p-6 transform transition-transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-green-400" />
                      <h3 className="text-gray-300 font-medium">Registration Time</h3>
                    </div>
                    <p className="text-white text-lg font-semibold">{userData.timestamp}</p>
                  </div>

                  {/* Wallet Address */}
                  <div className="bg-gray-800/50 rounded-xl p-6 transform transition-transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-2">
                      <Wallet className="h-5 w-5 text-pink-400" />
                      <h3 className="text-gray-300 font-medium">Wallet Address</h3>
                    </div>
                    <p className="text-white text-lg font-semibold break-all">
                      {userData.useraddress}
                    </p>
                  </div>
                </div>

                {/* Data Hash Section */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Hash className="h-5 w-5 text-orange-400" />
                    <h3 className="text-gray-300 font-medium">Data Hash</h3>
                  </div>
                  {userData.datahash ? (
                    <a
                      href={getIPFSLink(userData.datahash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-300"
                    >
                      <span className="text-lg font-semibold break-all">
                        {userData.datahash}
                      </span>
                      <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                    </a>
                  ) : (
                    <p className="text-white text-lg font-semibold">
                      No data hash available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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

export default UserProfile;