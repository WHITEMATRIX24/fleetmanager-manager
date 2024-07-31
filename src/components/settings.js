import React, { useContext } from 'react';
import { ThemeContext } from './themecontext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './settings.css';

const Settings = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <div className="settings-container">
            <div className="left-section">
                <h2>THEME SETTINGS</h2>
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
        </div>
    );
};

export default Settings;
