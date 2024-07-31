// src/components/SplashScreen.js
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './SplashScreen.css';
import logo from '../assets/images/logo.png'; // Ensure the logo file exists in this path

const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 2 }}
        >
            <motion.img
                src={logo}
                alt="Logo"
                className="splash-logo"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
            />
        </motion.div>
    );
};

export default SplashScreen;
