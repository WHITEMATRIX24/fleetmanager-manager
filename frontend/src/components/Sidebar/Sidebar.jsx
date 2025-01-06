import { faArrowRightFromBracket, faCarSide, faEnvelope, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './Sidebar.css';

function Sidebar() {
    const [activeItem, setActiveItem] = useState('Dashboard1');
    const [hoveredItem, setHoveredItem] = useState(null); // Track the hovered item
    const sectionRefs = useRef({});
    const sections = ['Dashboard1', 'vehicle', 'scratches', 'driver', 'tripss', 'worksho', 'notess', 'settingss'];
    const navigate = useNavigate(); // Use navigate for routing

    const handleItemClick = (event, item) => {
        event.preventDefault();
        setActiveItem(item);
        const section = document.getElementById(item);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        navigate('/'); // Redirect to the root page
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
        <>
            <div className="sidebar-content">
                <div className="profile-img"></div>

                <nav>
                    <ul>
                        {sections.map(section => (
                            <li
                                key={section}
                                className={activeItem === section ? 'active' : ''}
                                onMouseEnter={() => setHoveredItem(section)} // Set hovered item
                                onMouseLeave={() => setHoveredItem(null)}   // Clear hovered item
                            >
                                <a href={`#${section}`} onClick={(e) => handleItemClick(e, section)}>
                                    <i className={`fa fa-${getIcon(section)}`}></i>
                                </a>
                                {hoveredItem === section && ( // Show the comment box when hovered
                                    <div className="hover-box">{getText(section)}</div>
                                )}
                            </li>
                        ))}
                        {/* Logout Icon */}
                        <li
                            onClick={handleLogout}
                            onMouseEnter={() => setHoveredItem("logout")}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <a href="logout">
                                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                            </a>
                            {hoveredItem === "logout" && (
                                <div className="hover-box">Logout</div>
                            )}
                        </li>

                    </ul>
                </nav>
            </div>
        </>
    );
}

const getIcon = (section) => {
    switch (section) {
        case 'Dashboard1': return 'home';
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
        case 'Dashboard1': return 'Dashboard';
        case 'vehicle': return 'Vehicle';
        case 'scratches': return 'Scratches';
        case 'driver': return 'Driver';
        case 'tripss': return 'Trips';
        case 'worksho': return 'Workshop';
        case 'notess': return 'Notes';
        case 'settingss': return 'Settings';
        default: return '';
    }
};

export default Sidebar;
