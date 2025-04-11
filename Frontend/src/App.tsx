import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import ReportAnalyzer from './pages/ReportAnalyzer';
import Emergency from './pages/Emergency';
import Profile from './pages/About';
import Footer from './components/Footer';
import MedicationTracker from './pages/MedicationTracker';
import { Toaster } from 'react-hot-toast';
import { MedicationProvider } from './context/MedicationContext';
import AuthForm from "./pages/Auth"

function App() {
  return (
    <MedicationProvider>
      <Router>
   
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/analyzer" element={<ReportAnalyzer />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/about" element={<Profile />} />
              <Route path="/medication" element={<MedicationTracker />} />
              <Route path="/Auth" element={<AuthForm />} />

       
            </Routes>
          </div>
          <Toaster position="bottom-right" />
          <Footer />
      
      </Router>
    </MedicationProvider>
     );
}

export default App;