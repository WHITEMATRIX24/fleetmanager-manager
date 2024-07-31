import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import profilePhoto from '../assets/images/image.jpeg';
import { ReactComponent as CarSideIcon } from '../assets/images/car-side-svgrepo-com.svg';
import Notification from './Notofication';
import ChangePasswordModal from './ChangePasswordModal';
import SosNotification from './sosNotification';

function Header() {
    const [totalTrips, setTotalTrips] = useState(0);
    const [monthlyTrips, setMonthlyTrips] = useState(0);
    const [weeklyTrips, setWeeklyTrips] = useState(0);
    const [dailyTrips, setDailyTrips] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [managerUsername, setManagerUsername] = useState('');
    const [tripNotifications, setTripNotifications] = useState([]);
    const [showTripNotifications, setShowTripNotifications] = useState(false);
    const [showSosPopup, setShowSosPopup] = useState(false);
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [hasSosNotifications, setHasSosNotifications] = useState(false);
    const [hasCommentNotifications, setHasCommentNotifications] = useState(false);

    useEffect(() => {
        const fetchTripStatistics = async () => {
            try {
                const responseTotal = await fetch('http://localhost:5000/api/tripCount');
                const dataTotal = await responseTotal.json();
                setTotalTrips(dataTotal.count);

                const responseMonthly = await fetch('http://localhost:5000/api/monthlyTrips');
                const dataMonthly = await responseMonthly.json();
                setMonthlyTrips(dataMonthly.count);

                const responseWeekly = await fetch('http://localhost:5000/api/weeklyTrips');
                const dataWeekly = await responseWeekly.json();
                setWeeklyTrips(dataWeekly.count);

                const responseDaily = await fetch('http://localhost:5000/api/dailyTrips');
                const dataDaily = await responseDaily.json();
                setDailyTrips(dataDaily.count);

                const responseNotifications = await fetch('http://localhost:5000/api/dueDates');
                const dataNotifications = await responseNotifications.json();
                setNotifications(parseNotifications(dataNotifications));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTripStatistics();
    }, []);

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

    useEffect(() => {
        const fetchSosAndCommentNotifications = async () => {
            try {
                const sosResponse = await fetch('http://localhost:5000/api/issues?type=sos');
                const sosData = await sosResponse.json();
                setHasSosNotifications(sosData.issues.length > 0);

                const commentResponse = await fetch('http://localhost:5000/api/issues?type=comment');
                const commentData = await commentResponse.json();
                setHasCommentNotifications(commentData.issues.length > 0);
            } catch (error) {
                console.error('Error fetching SOS or comment notifications:', error);
            }
        };

        fetchSosAndCommentNotifications();
    }, []);

    const parseNotifications = (data) => {
        const notifications = [];

        const formatDate = (isoString) => {
            const date = new Date(isoString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        data.vehicles.forEach(vehicle => {
            if (vehicle.insuranceDueDate) {
                notifications.push(`Insurance due date of car ${vehicle.vehicleNumber} is on ${formatDate(vehicle.insuranceDueDate)}`);
            }
            if (vehicle.istimaraDueDate) {
                notifications.push(`Istimara due date of car ${vehicle.vehicleNumber} is on ${formatDate(vehicle.istimaraDueDate)}`);
            }
        });

        data.drivers.forEach(driver => {
            notifications.push(`Licence expiry date of driver with ID ${driver.driverId} is on ${formatDate(driver.driverLicenceExpiryDate)}`);
        });

        return notifications;
    };

    const handleRemoveNotification = (index) => {
        const newNotifications = [...notifications];
        newNotifications.splice(index, 1);
        setNotifications(newNotifications);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const openChangePasswordModal = () => {
        setShowChangePasswordModal(true);
    };

    const closeChangePasswordModal = () => {
        setShowChangePasswordModal(false);
    };

    const fetchTripNotifications = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tripNotifications');
            const data = await response.json();
            setTripNotifications(data.notifications);
        } catch (error) {
            console.error('Error fetching trip notifications:', error);
        }
    };

    const toggleTripNotifications = () => {
        setShowTripNotifications(!showTripNotifications);
        if (!showTripNotifications) {
            fetchTripNotifications();
        }
    };

    const handleSosClick = () => {
        setShowSosPopup(true);
    };

    const handleCommentClick = () => {
        setShowCommentPopup(true);
    };

    return (
        <header className="headero">
            <div className="header-org">
                <h1>WELCOME TO <span>247 FLEET MANAGER</span></h1>
                <div className="search-container">
                    <input className="search-header" type="text" placeholder="Search" />
                </div>
                <div className="icons-container">
                    <div className="notification-icon" onClick={handleSosClick}>
                        <i className="fas fa-exclamation-triangle"></i>
                        {hasSosNotifications && <span className="notification-dot red"></span>}
                    </div>
                    <div className="notification-icon" onClick={handleCommentClick}>
                        <i className="fas fa-comment"></i>
                        {hasCommentNotifications && <span className="notification-dot red"></span>}
                    </div>
                    <div className="notification-icon" onClick={() => setShowPopup(true)}>
                        <i className="fas fa-exclamation-circle"></i>
                        {notifications.length > 0 && <span className="notification-dot"></span>}
                    </div>
                </div>
                <div className="vertical-line"></div>
                <div className="profile-container">
                    <img src={profilePhoto} alt="Profile" className="profile-photo" onClick={toggleDropdown} />
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item">{managerUsername}</div>
                            <div><button className="dropdown-item-button" onClick={openChangePasswordModal}>Change Password</button></div>
                            <Link to="/" className="dropdown-item-button">Logout</Link>
                        </div>
                    )}
                </div>

                <div className="stats">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <CarSideIcon />
                        </div>
                        <div className='vertical-line-car'></div>
                        <div>
                            <div className="stat-label">Number of Trips</div>
                            <div className="stat-value">{totalTrips}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <CarSideIcon />
                        </div>
                        <div className='vertical-line-car'></div>
                        <div>
                            <div className="stat-label">Weekly Trips</div>
                            <div className="stat-value">{weeklyTrips}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <CarSideIcon />
                        </div>
                        <div className="vertical-line-car"></div>
                        <div>
                            <div className="stat-label">Monthly Trips</div>
                            <div className="stat-value">{monthlyTrips}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <CarSideIcon className="car-side-icon" />
                        </div>
                        <div className="vertical-line-car"></div>
                        <div>
                            <div className="stat-label">Daily Trips</div>
                            <div className="stat-value">{dailyTrips}</div>
                        </div>
                    </div>
                </div>
            </div>
            <Notification
                notifications={notifications}
                handleRemoveNotification={handleRemoveNotification}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
            />
            <ChangePasswordModal
                show={showChangePasswordModal}
                onClose={closeChangePasswordModal}
                username={managerUsername}
            />
            {showTripNotifications && (
                <div className="trip-notifications-popup">
                    <h2>Trip Notifications</h2>
                    <ul>
                        {tripNotifications.map((notification, index) => (
                            <li key={index}>{notification}</li>
                        ))}
                    </ul>
                    <button onClick={toggleTripNotifications}>Close</button>
                </div>
            )}
            {showSosPopup && (
                <SosNotification
                    type="sos"
                    onClose={() => setShowSosPopup(false)}
                />
            )}
            {showCommentPopup && (
                <SosNotification
                    type="comment"
                    onClose={() => setShowCommentPopup(false)}
                />
            )}
        </header>
    );
}

export default Header;
