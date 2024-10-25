import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, Search, Database, Clock, Loader2, Tag } from 'lucide-react';
import Navbar from './shared/NavBar';

const KnowledgeAgent = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [recentQueries, setRecentQueries] = useState([]);

  const categories = [
    { id: 'all', name: 'All Knowledge', icon: Database },
    { id: 'ml', name: 'Machine Learning', icon: Brain },
    { id: 'nlp', name: 'Natural Language', icon: BookOpen },
    { id: 'vision', name: 'Computer Vision', icon: Search }
  ];

  const processQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    // Simulate ML model processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newResult = {
      id: Date.now(),
      query: query,
      category: activeCategory,
      answer: `AI-generated response for query: "${query}"`,
      confidence: Math.random() * 0.3 + 0.7,
      sources: [
        { name: 'Knowledge Base', reliability: 0.95 },
        { name: 'Research Papers', reliability: 0.88 }
      ],
      tags: ['AI', 'ML', 'Neural Networks'].sort(() => Math.random() - 0.5).slice(0, 2),
      timestamp: new Date()
    };

    setResults(prev => [newResult, ...prev]);
    setRecentQueries(prev => [query, ...prev.slice(0, 4)]);
    setQuery('');
    setIsLoading(false);
  };

  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Knowledge Agent
          </h1>
          <p className="text-gray-600">
            Access and analyze information using our AI-powered knowledge base
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4 px-2">Categories</h2>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-lg transition-all
                      ${activeCategory === category.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'hover:bg-gray-100 text-gray-700'}
                    `}
                  >
                    <category.icon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Queries */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Recent Queries</h2>
              <div className="space-y-2">
                {recentQueries.map((q, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => setQuery(q)}
                  >
                    <Clock className="h-4 w-4 inline mr-2 text-gray-400" />
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything..."
                    className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 
                             focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && processQuery()}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  onClick={processQuery}
                  disabled={isLoading || !query.trim()}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all flex items-center
                    ${isLoading || !query.trim()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'}
                  `}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="space-y-4">
              {results.map(result => (
                <div key={result.id} className="bg-white rounded-xl shadow-lg p-6">
                  {/* Query and Category */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800">{result.query}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Answer */}
                  <p className="text-gray-600 mb-4">{result.answer}</p>

                  {/* Confidence and Sources */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Confidence:</span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-emerald-500 rounded-full"
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Tags and Sources */}
                  <div className="flex flex-wrap items-center gap-2">
                    {result.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {result.sources.map((source, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        title={`Reliability: ${(source.reliability * 100).toFixed(1)}%`}
                      >
                        {source.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {!results.length && !isLoading && (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Ask any question to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default KnowledgeAgent;