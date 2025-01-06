import React, { useState, useEffect, useRef } from 'react';
import './sidebar.css'; // Assuming you have defined your CSS styles in sidebar.css
import logo from '../assets/images/logo.png'; // Adjust the path based on your file structure
import leaf from '../assets/images/leaf.png'; // Adjust the path based on your file structure

function Sidebar() {
    const [activeItem, setActiveItem] = useState('dashboard');
    const sectionRefs = useRef({});

    const sections = ['dashboard', 'vehicle', 'scratches', 'driver', 'tripss', 'worksho', 'notess', 'settingss'];

    const handleItemClick = (event, item) => {
        event.preventDefault();
        setActiveItem(item);
        const section = document.getElementById(item);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        sections.forEach(section => {
            sectionRefs.current[section] = document.getElementById(section);
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: [1.0, 1.0],
        };

        const observerCallback = (entries) => {
            let closestSection = null;
            let closestDistance = Number.POSITIVE_INFINITY;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const rect = entry.boundingClientRect;
                    const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestSection = entry.target.id;
                    }
                }
            });

            if (closestSection) {
                setActiveItem(closestSection);
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => {
            const ref = sectionRefs.current[section];
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="sidebar">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <nav>
                <ul>
                    {sections.map(section => (
                        <li key={section} className={activeItem === section ? 'active' : ''}>
                            <a href={`#${section}`} onClick={(e) => handleItemClick(e, section)}>
                                <i className={`fa fa-${getIcon(section)}`}></i>
                                <span className="icon-text">{getText(section)}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="leafimg">
                <img src={leaf} alt="Leaf" />
            </div>
        </div>
    );
}

const getIcon = (section) => {
    switch (section) {
        case 'dashboard': return 'home';
        case 'vehicle': return 'car';
        case 'scratches': return 'pen';
        case 'driver': return 'user';
        case 'tripss': return 'map-marker';
        case 'worksho': return 'wrench';
        case 'notess': return 'sticky-note';
        case 'settingss': return 'cog';
        default: return 'circle';
    }
};

const getText = (section) => {
    switch (section) {
        case 'dashboard': return 'Home';
        case 'vehicle': return 'Vehicle';
        case 'scratches': return 'Add Scratch';
        case 'driver': return 'Driver';
        case 'tripss': return 'Trips';
        case 'worksho': return 'Workshop Movement';
        case 'notess': return 'Notes';
        case 'settingss': return 'Settings';
        default: return '';
    }
};

export default Sidebar;
