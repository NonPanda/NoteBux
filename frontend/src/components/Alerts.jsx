import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alerts.css'; // Optional: Add some styling for alerts

const ITEMS_PER_PAGE = 4; // Number of daily alerts shown per "page" in the carousel

const AlertsPage = ({ user }) => {
  const [dailyAlerts, setDailyAlerts] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newReminder, setNewReminder] = useState({ content: '', time: '' });
  const colorOptions = ['#D9E8FC', '#FFEADD', '#FFD8F4', '#FDE99D', '#B0E9CA', '#FFDBE4', '#FCFAD9'];

  // Pagination state for daily alerts
  const [dailyPage, setDailyPage] = useState(0);

  useEffect(() => {
    if (user) {
      // Fetch all daily alerts
      axios.get('http://localhost:5000/api/drafts', {
        headers: {
          Authorization: `Bearer ${user.uid}`,
        },
      })
      .then(res => {
        const allAlerts = res.data;

        // Assign random colors to each alert
        const alertsWithColors = allAlerts.map(alert => ({
          ...alert,
          color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        }));

        // Filter daily alerts
        const daily = alertsWithColors.filter(alert => alert.daily);
        setDailyAlerts(daily);
      })
      .catch(err => console.error('Error fetching daily alerts:', err));

      // Fetch reminders from the alerts schema (reminders)
      axios.get('http://localhost:5000/api/alerts', {
        headers: {
          Authorization: `Bearer ${user.uid}`,
        },
      })
      .then(res => {
        setReminders(res.data); // Assuming the backend sends an array of reminders
      })
      .catch(err => console.error('Error fetching reminders:', err));
    }
  }, [user]);

  // Handle navigation for daily alerts
  const handleDailyNext = () => {
    if ((dailyPage + 1) * ITEMS_PER_PAGE < dailyAlerts.length) {
      setDailyPage(dailyPage + 1);
    }
  };

  const handleDailyPrev = () => {
    if (dailyPage > 0) {
      setDailyPage(dailyPage - 1);
    }
  };

  // Handle adding a new reminder
  const handleAddReminder = () => {
    if (newReminder.content && newReminder.time) {
      axios.post('http://localhost:5000/api/alerts', newReminder, {
        headers: {
          Authorization: `Bearer ${user.uid}`, // Make sure this user.uid is correct
        },
      })
      .then(res => {
        setReminders([...reminders, res.data]); // Add the new reminder to the current list
        setNewReminder({ content: '', time: '' }); // Reset the form
        setShowPopup(false); // Close the popup
      })
      .catch(err => {
        console.error('Error adding reminder:', err);
      });
    }
  };

  // Handle removing a reminder
  const handleRemoveReminder = (id) => {
    axios.delete(`http://localhost:5000/api/alerts/${id}`, {
      headers: {
        Authorization: `Bearer ${user.uid}`,
      },
    })
    .then(() => {
      setReminders(reminders.filter(reminder => reminder._id !== id)); // Remove the reminder from the list
    })
    .catch(err => console.error('Error removing reminder:', err));
  };

  return (
    <div className="alerts-page">
      {/* Daily Task Updates Section */}
      <h2 className="folder-title">
        <span role="img" aria-label="Daily">📅</span> Daily Task Updates
      </h2>
      <div className="folder daily-folder">
        <button onClick={handleDailyPrev} disabled={dailyPage === 0} className="arrow-button">{"<"}</button>
        <div className="carousel-container">
          <div className="alerts-carousel">
            {dailyAlerts.slice(dailyPage * ITEMS_PER_PAGE, (dailyPage + 1) * ITEMS_PER_PAGE).map(alert => (
              <div key={alert._id} className="alert-card" style={{ backgroundColor: alert.color }}>
                <h3>{alert.title}</h3>
                <p>{alert.content.substring(0, 100)}...</p> {/* Show a preview */}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleDailyNext} disabled={(dailyPage + 1) * ITEMS_PER_PAGE >= dailyAlerts.length} className="arrow-button">{">"}</button>
      </div>

      {/* Reminders Section */}
      <h2 className="folder-title">
        <span role="img" aria-label="Reminders">⏰</span> Reminders
      </h2>
      <div className="reminders-section">
        <div className="reminder-list">
          {reminders.map((reminder) => (
            <div key={reminder._id} className="reminder-card">
              <button className="remove-button" onClick={() => handleRemoveReminder(reminder._id)}>x</button>
              <p>{reminder.content}</p>
              <span>{reminder.time}</span>
            </div>
          ))}
        </div>
        <button className="add-reminder-button" onClick={() => setShowPopup(true)}>+ Add Reminder</button>
      </div>

      {/* Popup for Adding a New Reminder */}
      {showPopup && (
        <div className="reminder-popup">
          <div className="popup-content">
            <h3>Add Reminder</h3>
            <input
              type="text"
              name="content"
              placeholder="Reminder content"
              value={newReminder.content}
              onChange={(e) => setNewReminder({ ...newReminder, content: e.target.value })}
            />
            <input
              type="time"
              name="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
            />
            <button onClick={handleAddReminder}>Add</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
