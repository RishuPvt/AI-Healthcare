import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import ReportAnalyzer from './pages/ReportAnalyzer';
import Emergency from './pages/Emergency';
import About from './pages/About';
import Footer from './components/Footer';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/analyzer" element={<ReportAnalyzer />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;