import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LoginPage.css';
import logo from '../assets/images/logo.png'
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log('Attempting login with username:', username); // Log the username being attempted
            console.log('Attempting login with password:', password); // Log the password being attempted

            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Send actual username and password from state
            });

            console.log('Response status:', response.status); // Log response status

            if (!response.ok) {
                throw new Error('Invalid credentialsnot found');
            }

            const data = await response.json();
            console.log('Login data:', data); // Log response data

            if (data.success) {
                navigate('/dashboard');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again later.');
        }
    };

    return (
        <motion.div
            className="login-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="login-page">
                <div className="login-container">
                    <h2>Login</h2>
                    <input
                        className='c-input-field-l'
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className='c-input-field-l'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='c-submit-button' onClick={handleLogin}>Login</button>
                </div>
                <div className="sidecolor">
                    <div className="side-logo">
                        <img src={logo} alt="Logo" /> {/* Ensure the path to the logo is correct */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LoginPage;
