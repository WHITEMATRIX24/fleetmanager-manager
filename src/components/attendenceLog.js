import React, { useEffect, useState } from 'react';
import './attendence.css';
import axios from 'axios';

const AttendanceLog = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Start with an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSearch = () => {
    // When searching, set the filtered data based on attendance data
    if (selectedDate) {
      const filtered = attendanceData.map((record) => {
        const attendanceOnDate = record.attendanceRecords.find(
          (attendance) => attendance.checkInDate === selectedDate
        );

        // If attendance is found for the selected date, return the record with the attendance
        return {
          ...record,
          attendanceOnDate, // This will be `undefined` if no attendance is found
        };
      });
      setFilteredData(filtered);
    } else {
      setFilteredData([]); // Reset to empty if no date is selected
    }
  };

  const calculateTotalWorkingHoursAndStatus = (checkInTime, checkOutTime) => {
    if (!checkInTime) return { totalWorkingHours: 'N/A', status: 'On Leave' };
    if (!checkOutTime) return { totalWorkingHours: 'N/A', status: 'Regular' };

    const convertTo24HourFormat = (time) => {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);

      if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }

      return { hours, minutes };
    };

    const { hours: checkInHours, minutes: checkInMinutes } = convertTo24HourFormat(checkInTime);
    const { hours: checkOutHours, minutes: checkOutMinutes } = convertTo24HourFormat(checkOutTime);

    const checkInDate = new Date(1970, 0, 1, checkInHours, checkInMinutes);
    const checkOutDate = new Date(1970, 0, 1, checkOutHours, checkOutMinutes);

    const totalMilliseconds = checkOutDate - checkInDate;
    const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    const status = totalHours >= 12 ? 'Overtime' : 'Regular';

    return { totalWorkingHours: `${totalHours}h ${totalMinutes}m`, status };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceResponse, driversResponse] = await Promise.all([
          axios.get('https://fleetmanager-manager.onrender.com/api/attendance'),
          axios.get('https://fleetmanager-manager.onrender.com/api/drivers/names'),
        ]);

        const drivers = {};
        driversResponse.data.forEach((driver) => {
          drivers[driver.driverId] = driver.driverName;
        });

        const updatedAttendanceData = attendanceResponse.data.map((record) => {
          const driverName = drivers[record.driverId] || 'N/A';
          return {
            ...record,
            driverName,
          };
        });

        setAttendanceData(updatedAttendanceData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const sortedFilteredData = filteredData.sort((a, b) => a.driverId - b.driverId);

  return (
    <div className="attendance-log-container">
      <div className="loading-error-container">
        {loading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">Error: {error}</p>}
      </div>
      <div className="attendance-log-header">
        <h2>Driver Attendance</h2>
        <div className="attendance-log-filters">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Select a date"
            max={today}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <table className="attendance-log-table">
        <thead>
          <tr>
            <th>Driver Id</th>
            <th>Driver Name</th>
            <th>Check-In Time</th>
            <th>Check-Out Time</th>
            <th>Total Working Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            sortedFilteredData.map((record) => {
              const attendance = record.attendanceOnDate;
              const { totalWorkingHours, status } = attendance
                ? calculateTotalWorkingHoursAndStatus(attendance.checkInTime, attendance.checkOutTime)
                : { totalWorkingHours: 'N/A', status: 'On Leave' };

              return (
                <tr key={record.driverId}>
                  <td>{record.driverId}</td>
                  <td>{record.driverName}</td>
                  <td>{attendance ? attendance.checkInTime : 'N/A'}</td>
                  <td>{attendance ? attendance.checkOutTime : 'N/A'}</td>
                  <td>{totalWorkingHours}</td>
                  <td>{status}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No attendance records found for the selected date. Please try selecting a different date.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceLog;
