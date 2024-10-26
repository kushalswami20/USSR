import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Loader2, ImagePlus } from 'lucide-react';
import Navbar from './shared/NavBar';
import { useChatSession } from "../hooks/usechatsession";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const apiKey = 'MuTuMMIFYp6FZkf1XoJwrT3Bc2WScUN8';
  const externalUserId = '1';
  const { sessionId, response, error, initializeSession, sendQuery } = useChatSession(apiKey, externalUserId);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    if (response) {
      handleApiResponse(response);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      console.error('Chat session error:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date()
      }]);
      setIsProcessing(false);
    }
  }, [error]);

  const handleApiResponse = (response) => {
    try {
      const assistantContent = response?.data?.responseMessage || 
                             response?.data?.answer || 
                             response?.data?.message ||
                             response?.responseMessage ||
                             response?.message;

      if (assistantContent) {
        const assistantMessage = {
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        console.warn('No valid response content found:', response);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error processing response:', err);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Sorry, I received an invalid response. Please try again.',
        timestamp: new Date()
      }]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'Image size must be less than 5MB.',
          timestamp: new Date()
        }]);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const message = {
          role: 'user',
          content: '',
          image: e.target.result,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, message]);
        setSelectedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processMessage = async () => {
    if ((!userInput.trim() && !selectedImage) || isProcessing) return;
    
    setIsProcessing(true);
    const userMessage = {
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      await sendQuery(userInput.trim());
    } catch (err) {
      console.error('Error sending query:', err);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Failed to send message. Please check your connection and try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="relative min-h-[calc(100vh-64px)]">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 animate-fade-in">
              AI Assistant
            </h1>
            <p className="text-gray-400 animate-slide-up">
              Chat with our intelligent assistant to get help with your queries
            </p>
          </div>

          <div className="relative backdrop-blur-lg bg-white/5 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  Start a conversation by sending a message or uploading an image
                </div>
              )}
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`
                    max-w-[80%] rounded-2xl p-4 shadow-lg
                    ${message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : message.role === 'system'
                        ? 'bg-red-500/20 text-red-200'
                        : 'bg-white/10 backdrop-blur-md text-gray-200'}
                    transform transition-all duration-300 hover:scale-[1.02]
                  `}>
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Uploaded content"
                        className="max-w-full rounded-lg mb-2 max-h-64 object-contain"
                      />
                    )}
                    <div className="text-sm">
                      {message.content}
                    </div>
                    <div className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 bg-white/5 backdrop-blur-lg p-4">
              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-300"
                  title="Upload image"
                >
                  <ImagePlus className="h-5 w-5" />
                </button>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows="1"
                  className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-3 
                    border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                    outline-none resize-none transition-all duration-300"
                />
                <button
                  onClick={processMessage}
                  disabled={isProcessing || !userInput.trim()}
                  className={`
                    p-3 rounded-xl font-medium transition-all duration-300
                    ${isProcessing || !userInput.trim()
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5'}
                    flex items-center justify-center min-w-[2.5rem]
                  `}
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send, Shift + Enter for new line
              </div>
            </div>
          </div>
        </div>
      </div>

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
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ChatComponent;