import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ChatbotPage from './components/ChatBot';
import MetaMaskConnector from './components/MetaMaskConnector';
import AddUserForm from './components/AddUserForm';
import UserProfile from './components/Profile';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
      <Route path="/home" element= {<Home />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/adduser" element={<AddUserForm />} />
      {/* <Route path='/storingdata' elemnt={< ImageUpload />} /> */}
      <Route path ='/profile' element ={<UserProfile />} />
      <Route path="/" element={<MetaMaskConnector />} />
      </Routes>
    </Router>
  )
}

export default App
