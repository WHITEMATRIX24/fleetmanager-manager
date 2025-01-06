import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './themecontext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './settings.css';
import ChangePasswordModal from './ChangePasswordModal';

const Settings = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const [managerUsername, setManagerUsername] = useState('');
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    useEffect(() => {
        const fetchManagerUsername = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getManagerUsername');
                const data = await response.json();
                setManagerUsername(data.managerUsername);
            } catch (error) {
                console.error('Error fetching manager username:', error);
            }
        };

        fetchManagerUsername();
    }, []);
    const openChangePasswordModal = () => {
        setShowChangePasswordModal(true);
    };
    const closeChangePasswordModal = () => {
        setShowChangePasswordModal(false);
    };
    return (
        <div className="settings-container">
            <div className="left-section-settings">
                <h2>SETTINGS</h2>
                <div className='settings-manager-div'>
                    <div className="settings-manager"> <h3 > Username: {managerUsername}</h3></div>
                    <div><button className="settings-passwordchange" onClick={openChangePasswordModal}>Change Password</button></div>
                </div>
                <div className="theme-option">
                    <FontAwesomeIcon icon={faSun} color='var(--secondary-color' />
                    <span>Light Theme</span>
                    <div className={`toggle-switch ${theme === 'green-theme' ? 'on' : 'off'}`} onClick={() => handleThemeChange('green-theme')}>
                        <div className="switch"></div>
                        <span>{theme === 'green-theme' ? ' ' : ' '}</span>
                    </div>
                </div>
                <div className="theme-option">
                    <FontAwesomeIcon icon={faMoon} color='var(--secondary-color' />
                    <span>Dark Theme</span>
                    <div className={`toggle-switch ${theme === 'navy-blue-theme' ? 'on' : 'off'}`} onClick={() => handleThemeChange('navy-blue-theme')}>
                        <div className="switch"></div>
                        <span>{theme === 'navy-blue-theme' ? '' : ''}</span>
                    </div>
                </div>
            </div>
            {showChangePasswordModal &&
                <ChangePasswordModal
                    show={showChangePasswordModal}
                    onClose={closeChangePasswordModal}
                    username={managerUsername}
                />
            }
        </div>


    );
};

export default Settings;
