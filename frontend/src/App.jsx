import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css'
import Home from './components/Home';
import SearchClaimAgent from './components/SearchClaimAgent';
import ChatbotPage from './components/ChatBot';
import KnowledgeAgent from './components/KnowledgeAgent';
import ImageUpload from './components/StoringData';
import MetaMaskConnector from './components/MetaMaskConnector';
import AddUserForm from './components/AddUserForm';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
      <Route path="/home" element= {<Home />} />
      <Route path="/searchclaimagent" element={<SearchClaimAgent />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/knowledgeagent" element={<KnowledgeAgent />} />
      <Route path="/adduser" element={<AddUserForm />} />
      {/* <Route path='/storingdata' elemnt={< ImageUpload />} /> */}
      <Route path="/" element={<MetaMaskConnector />} />
      </Routes>
    </Router>
  )
}

export default App
