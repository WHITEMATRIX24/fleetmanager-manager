// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './components/dashboard';
import EditCar from './components/editcar';
import EditDriver from './components/editdriver';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import ThemeProvider from './components/themecontext';
import './index.css';  // Import the theme CSS
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <AnimatePresence mode="wait">
            {showSplash ? (
              <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
            ) : (
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/editcar" element={<EditCar />} />
                <Route path="/editdriver" element={<EditDriver />} />
              </Routes>
            )}
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
