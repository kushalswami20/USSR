import React, { useState, useEffect } from 'react';
import { CardHeader, Card, CardContent} from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, Check , Wallet} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useNavigate } from 'react-router-dom';
// import MedXchainLogo from "../assets/MedXchain.png"
// import BackgroundImage from '../assets/download22.jpeg'; // Import your background image

const MetaMaskConnector = () => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [chainId, setChainId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfWalletIsConnected();
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setError('Please connect to MetaMask.');
    } else {
      setAccount(accounts[0]);
      setError('');
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId, 16));
    window.location.reload();
  };

  const handleDisconnect = () => {
    setAccount('');
    setError('Wallet disconnected');
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chain = await window.ethereum.request({ method: 'eth_chainId' });
      
      setChainId(parseInt(chain, 16));

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      setError('Error checking wallet connection');
      console.error('Error checking wallet connection:', err);
    }
  };

  const movetoRolesection = (role) => {
    if(role === 'go') {
      navigate("/home")
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);
      setError('');
      
    } catch (err) {
      if (err.code === 4001) {
        setError('Please connect to MetaMask.');
      } else {
        setError('Error connecting to wallet');
        console.error('Error connecting to wallet:', err);
      }
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Background Pattern */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md relative group 
              backdrop-blur-lg bg-white/5 
              transition-all duration-500 ease-out
              hover:scale-[1.02] animate-slide-up
              border-0 shadow-xl hover:shadow-2xl shadow-blue-500/20">
              
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
              
              <CardHeader className="relative z-10 text-center pb-0">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-600 p-4 rounded-xl shadow-lg shadow-blue-500/30">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Connect Wallet
                </h2>
              </CardHeader>
  
              <CardContent className="relative z-10 space-y-6 pt-6">
                {error && (
                  <Alert variant="destructive" className="border-0 bg-red-500/10 text-red-200 backdrop-blur-sm animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
  
                {account ? (
                  <div className="space-y-4 animate-fade-in">
                    <Alert className="border-0 bg-green-500/10 text-green-200 backdrop-blur-sm">
                      <Check className="h-4 w-4" />
                      <AlertDescription>
                        Connected to: {account.slice(0, 6)}...{account.slice(-4)}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="text-sm text-gray-400 text-center">
                      Network ID: {chainId}
                    </div>
  
                    <Button
                      onClick={() => movetoRolesection('go')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                        text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/30
                        transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40
                        transform hover:-translate-y-1"
                    >
                      Enter Application
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={connectWallet}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                      text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/30
                      transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40
                      transform hover:-translate-y-1 animate-slide-up"
                  >
                    Connect Wallet
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
  
        {/* Add these styles to your global CSS if not already present */}
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

export default MetaMaskConnector;
