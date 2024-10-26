import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [account, setAccount] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const navigation = [
    { name: 'Home', href: '/Home' },
    { name: 'Account Connector', href: '/' },
    { name: 'Add User', href: '/adduser' },
    { name: 'ChatBot', href: '/chatbot' },
  ];

  const profileMenu = [
    { name: 'View Profile', href: '/profile', icon: User },
    // { name: 'Settings', href: '/', icon: Settings },
    { name: 'Add User', href: '/adduser', icon: UserPlus },
    { name: 'Logout', href: '/', icon: LogOut },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Connect to MetaMask and get account
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
      } else {
        console.log('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  // Initialize MetaMask connection and listen for account changes
  useEffect(() => {
    const initializeWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0] || '');
        });
      }
    };

    initializeWallet();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 shadow-xl">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              onClick={() => navigate('/')}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-2xl font-extrabold cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              SNAP INSURE
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${isActive(item.href) 
                    ? 'bg-white/10 text-blue-300 shadow-lg shadow-blue-500/20' 
                    : 'text-gray-300 hover:text-blue-300 hover:bg-white/5'
                  }
                `}
              >
                {item.name}
              </button>
            ))}

            {/* Profile Icon and Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => account ? setIsProfileOpen(!isProfileOpen) : connectWallet()}
                className={`
                  ml-4 p-2 rounded-full transition-all duration-300
                  ${isProfileOpen
                    ? 'bg-white/10 ring-2 ring-blue-400/50 shadow-lg'
                    : 'hover:bg-white/5'
                  }
                `}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-gray-800/95 backdrop-blur-md border border-gray-700/50 shadow-2xl py-1 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-700/50">
                    <p className="text-sm text-blue-300 font-medium">Connected Wallet</p>
                    <p className="text-xs text-gray-400 truncate">{formatAddress(account)}</p>
                  </div>

                  {profileMenu.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.href);
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-300 flex items-center space-x-3 transition-colors duration-150"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => account ? setIsProfileOpen(!isProfileOpen) : connectWallet()}
              className="p-2 rounded-full hover:bg-white/5"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-lg text-gray-300 hover:text-blue-300 hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsOpen(false);
                  }}
                  className={`
                    block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                    ${isActive(item.href)
                      ? 'bg-white/10 text-blue-300'
                      : 'text-gray-300 hover:text-blue-300 hover:bg-white/5'
                    }
                  `}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Profile Dropdown */}
        {isProfileOpen && (
          <div className="md:hidden absolute right-4 left-4 top-full mt-3 rounded-xl bg-gray-800/95 backdrop-blur-md border border-gray-700/50 shadow-2xl py-1 z-50 animate-fade-in">
            <div className="px-4 py-3 border-b border-gray-700/50">
              <p className="text-sm text-blue-300 font-medium">Connected Wallet</p>
              <p className="text-xs text-gray-400 truncate">{formatAddress(account)}</p>
            </div>

            {profileMenu.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-300 flex items-center space-x-3 transition-colors duration-150"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { 
            opacity: 0;
            transform: translateY(-8px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );

};

export default Navbar;