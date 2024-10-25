import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/Home' },
    { name: 'Account Connector', href: '/' },
    {name: 'Add User', href:'/adduser'},
    { name: 'ChatBot', href: '/chatbot' },
    // { name: 'Knowledge Agent', href: '/knowledgeagent' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              onClick={() => navigate('/')}
              className="text-white text-xl font-bold cursor-pointer"
            >
              ML Platform
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${isActive(item.href) 
                    ? 'bg-white bg-opacity-10 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5'
                  }
                `}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 
                hover:text-white hover:bg-white hover:bg-opacity-5 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsOpen(false);
                  }}
                  className={`
                    block w-full text-left px-4 py-2 rounded-lg text-base font-medium transition-all duration-300
                    ${isActive(item.href)
                      ? 'bg-white bg-opacity-10 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5'
                    }
                  `}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;