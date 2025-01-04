import { faArrowRightFromBracket, faCarSide, faEnvelope, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import '../Sidebar/Sidebar.css';
import { useNavigate } from 'react-router-dom';

function PageSidebar() {
    const [activeItem, setActiveItem] = useState('Dashboard1');
    const [hoveredItem, setHoveredItem] = useState(null); // Track the hovered item
    const sectionRefs = useRef({});
    const sections = ['dashboard'];
    const navigate = useNavigate();

    const handleItemClick = () => {
        navigate('/dashboard');
    };



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
                                <a href={`#${section}`} onClick={handleItemClick}>
                                    <i className={`fa fa-${getIcon(section)}`}></i>
                                </a>
                                {hoveredItem === section && ( // Show the comment box when hovered
                                    <div className="hover-box">{getText(section)}</div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}

const getIcon = (section) => {
    switch (section) {
        case 'dashboard': return 'home';
        default: return 'circle';
    }
};

const getText = (section) => {
    switch (section) {
        case 'dashboard': return 'Home';
        default: return '';
    }
};

export default PageSidebar;
