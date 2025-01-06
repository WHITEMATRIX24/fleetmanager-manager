// src/App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './components/dashboard';
import Dashboard1 from './Pages/Dashboard1';
import EditCar from './components/editcar';
import EditDriver from './components/editdriver';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import ThemeProvider from './components/themecontext';
import Attendence from './components/Attendence';
import ViewTrips from './components/ViewTrips';
import { useJsApiLoader } from '@react-google-maps/api';
import './index.css';  // Import the theme CSS
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  })

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
                <Route path="/dashboard" element={<Dashboard1 />} />
                <Route path="/editcar" element={<EditCar />} />
                <Route path="/editdriver" element={<EditDriver />} />
                <Route path="/attendence" element={<Attendence />} />
                <Route path="/viewtrip" element={<ViewTrips />} />
              </Routes>
            )}
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import MapComponent from './components/Mapdisplaytest';
// function App() {
//   // Hardcoded locations for demo purposes
//   const [locations] = useState([
//     { address: "Location 1", lat: 25.2856329, lng: 51.5264162 }, // New York City
//     { address: "Location 2", lat: 34.0522, lng: -118.2437 }, // Los Angeles
//   ]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Plot Locations on Map</h1>
//       <p>Hardcoded locations are being plotted for demonstration purposes.</p>
//       <MapComponent locations={locations} />
//     </div>
//   );
// }

// export default App;
