import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from './shared/NavBar';

const SearchClaimAgent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const processClaim = async (searchQuery) => {
    setIsLoading(true);
    // Simulate ML model processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults = [
      {
        id: Date.now(),
        claimNumber: 'CLM' + Math.floor(Math.random() * 10000),
        status: Math.random() > 0.5 ? 'approved' : 'pending',
        confidence: Math.random() * 0.5 + 0.5,
        details: `Claim analysis for "${searchQuery}"`,
        timestamp: new Date().toISOString()
      }
    ];
    
    setResults(mockResults);
    setSearchHistory(prev => [...prev, { query: searchQuery, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Claims Search Agent
          </h1>
          <p className="text-gray-600">
            Intelligent claim processing and verification system
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter claim details or policy number..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
            <button
              onClick={() => processClaim(query)}
              disabled={isLoading || !query.trim()}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${isLoading || !query.trim() 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'}
              `}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Process Claim'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Results Panel */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" />
              Analysis Results
            </h2>
            
            {results.map(result => (
              <div 
                key={result.id}
                className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">
                    Claim #{result.claimNumber}
                  </span>
                  <div className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${result.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{result.details}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Confidence:</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {!results.length && !isLoading && (
              <div className="text-center text-gray-500 py-8">
                No claims processed yet
              </div>
            )}
          </div>

          {/* History Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Search History</h2>
            <div className="space-y-3">
              {searchHistory.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-600 truncate">
                    {item.query}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SearchClaimAgent;