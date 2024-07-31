import React, { useState, useEffect, useRef } from 'react';
import './sidebar.css'; // Assuming you have defined your CSS styles in sidebar.css
import logo from '../assets/images/logo.png'; // Adjust the path based on your file structure
import leaf from '../assets/images/leaf.png'; // Adjust the path based on your file structure

function Sidebar() {
    const [activeItem, setActiveItem] = useState('dashboard');
    const sectionRefs = useRef({});

    const handleItemClick = (item) => {
        setActiveItem(item);
        document.getElementById(item).scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const sections = ['dashboard', 'vehicle', 'driver', 'scratches', 'trip', 'notes', 'key', 'workshop', 'settings'];
        sections.forEach(section => {
            sectionRefs.current[section] = document.getElementById(section);
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6, // Adjust the threshold as needed
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log(`Section ${entry.target.id} is intersecting`); // Debug log
                    setActiveItem(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => {
            const ref = sectionRefs.current[section];
            if (ref) {
                observer.observe(ref);
                console.log(`Observing section: ${section}`); // Debug log
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
                    <li className={activeItem === 'dashboard' ? 'active' : ''} onClick={() => handleItemClick('dashboard')}>
                        <a href="#dashboard">
                            <i className="fas fa-home"></i>
                            <span className="icon-text">Home</span> {/* Added span for icon text */}
                        </a>
                    </li>
                    <li className={activeItem === 'vehicle' ? 'active' : ''} onClick={() => handleItemClick('vehicle')}>
                        <a href="#vehicle">
                            <i className="fa fa-car"></i>
                            <span className="icon-text">Vehicle</span>
                        </a>
                    </li>
                    <li className={activeItem === 'scratches' ? 'active' : ''} onClick={() => handleItemClick('scratches')}>
                        <a href="#scratches">
                            <i className="fa fa-pen"></i>
                            <span className="icon-text">Add Scratch</span>
                        </a>
                    </li>
                    <li className={activeItem === 'driver' ? 'active' : ''} onClick={() => handleItemClick('driver')}>
                        <a href="#driver">
                            <i className="fas fa-user"></i>
                            <span className="icon-text">Driver</span>
                        </a>
                    </li>
                    <li className={activeItem === 'trip' ? 'active' : ''} onClick={() => handleItemClick('trip')}>
                        <a href="#trip">
                            <i className="fa fa-map-marker"></i>
                            <span className="icon-text">Trips</span>
                        </a>
                    </li>
                    <li className={activeItem === 'workshop' ? 'active' : ''} onClick={() => handleItemClick('workshop')}>
                        <a href="#workshop">
                            <i className="fa fa-wrench"></i>
                            <span className="icon-text">Workshop Movement</span>
                        </a>
                    </li>
                    <li className={activeItem === 'notes' ? 'active' : ''} onClick={() => handleItemClick('notes')}>
                        <a href="#notes">
                            <i className="fa fa-sticky-note"></i>
                            <span className="icon-text">Notes</span>
                        </a>
                    </li>
                    <li className={activeItem === 'settings' ? 'active' : ''} onClick={() => handleItemClick('settings')}>
                        <a href="#settings">
                            <i className="fas fa-cog"></i>
                            <span className="icon-text">Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <div className='leafimg'>
                <img src={leaf} alt="Leaf" />
            </div>
        </div>
    );
}

export default Sidebar;
