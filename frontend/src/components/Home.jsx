import React from 'react';
import { Phone, ImagePlus, BarChart3, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/NavBar';

const Home= () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "24/7 Accessible Support",
      description: "Customers can get answers any time without waiting, ensuring consistent, accurate assistance",
      icon: Phone,
      // route: "/searchclaimagent",
      bgColor: "bg-blue-600",
      shadowColor: "shadow-blue-500/50"
    },
    {
      title: " Policy Summarization ",
      description: "Complex policies are summarized into key points, making terms easily digestible",
      icon: FileText,
      // route: "/multiagent",
      bgColor: "bg-emerald-600",
      shadowColor: "shadow-emerald-500/50"
    },
    {
      title: "Profession-Specific Guidance",
      description: "Leveraging the ON DEMAND platform's built-in agents",
      icon: BarChart3,
      // route: "/knoweledgeagent",
      bgColor: "bg-purple-600",
      shadowColor: "shadow-purple-500/50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      {/* Features Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 animate-fade-in">
              Our Features
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Discover our powerful AI agents designed to streamline your workflow
              and enhance productivity
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              // onClick={() => navigate(feature.route)}
              className={`
                relative group rounded-2xl overflow-hidden 
                backdrop-blur-lg bg-white/5 
                transition-all duration-500 ease-out
                hover:scale-105 hover:-translate-y-2
                
                ${feature.shadowColor} hover:shadow-2xl
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-8 relative z-10">
                {/* Icon and Arrow */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`${feature.bgColor} p-3 rounded-xl shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              
              {/* Hover Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Get Started Button Section */}
        <div className="mt-20 text-center animate-fade-in">
          <button
            onClick={() => navigate('/chatbot')}
            className="
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:from-blue-700 hover:to-purple-700
              text-white font-bold py-4 px-8
              rounded-xl shadow-lg shadow-purple-500/30
              transition-all duration-300
              hover:shadow-xl hover:shadow-purple-500/40
              transform hover:-translate-y-1
              animate-slide-up
              relative group
              overflow-hidden
            "
          >
            <span className="relative z-10">Get Started with AI Chat</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mt-6">
            Try our AI chatbot to experience the power of intelligent conversation
          </p>
        </div>
      </div>

      {/* Add these styles to your global CSS */}
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

export default Home;