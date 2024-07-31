import React from 'react';
import './sidebar.css';
import logo from '../assets/images/logo.png';
import leaf from '../assets/images/leaf.png';
import { Link } from 'react-router-dom';

function PageSidebar() {
    return (
        <div className="sidebar">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <nav>
                <ul>
                    <li className='home'>
                        <Link to="/dashboard">
                            <i className="fas fa-home"></i>
                            <span className="icon-text">Home</span>
                        </Link>
                    </li>
                    <li className='vehicle'>
                        <Link to="/dashboard">
                            <i className="fa fa-car"></i>
                            <span className="icon-text">Vehicle</span>
                        </Link>
                    </li>
                    <li className='scratches'>
                        <Link to="/dashboard">
                            <i className="fa fa-pen"></i>
                            <span className="icon-text">Add Scratch</span>
                        </Link>
                    </li>
                    <li className='driver'>
                        <Link to="/dashboard">
                            <i className="fas fa-user"></i>
                            <span className="icon-text">Driver</span>
                        </Link>
                    </li>
                    <li className='trip'>
                        <Link to="/dashboard">
                            <i className="fa fa-map-marker"></i>
                            <span className="icon-text"> Trips</span>
                        </Link>
                    </li>
                    <li className='workshop'>
                        <Link to="/dashboard">
                            <i className="fa fa-wrench"></i>
                            <span className="icon-text">Workshop Movement</span>
                        </Link>
                    </li>
                    <li className='notes'>
                        <Link to="/dashboard">
                            <i className="fa fa-sticky-note"></i>
                            <span className="icon-text">Notes</span>
                        </Link>
                    </li>
                    <li className='settings'>
                        <Link to="/dashboard">
                            <i className="fas fa-cog"></i>
                            <span className="icon-text">Settings</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className='leafimg'>
                <img src={leaf} alt="Leaf" />
            </div>
        </div>
    );
}

export default PageSidebar;
