import React, { useState } from 'react';
import PageHeader from './pageheader';  // Include your header
import PageSidebar from './Pagesidebar';  // Include your sidebar
import AttendanceLog from './attendenceLog';
import './attendence.css';
import Sidebar from './Sidebar/Sidebar'


const Attendance = () => {
  const [selectedYear, setSelectedYear] = useState('2019');
  const [selectedMonth, setSelectedMonth] = useState('Mar');

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="attendance-page">
      <div className="page-body">
        <div className='attendance-sidebar'>
          <Sidebar />
        </div>
        <div className='attendence_table'>
          <AttendanceLog />
        </div>
      </div>
    </div>
  );
};

export default Attendance;




