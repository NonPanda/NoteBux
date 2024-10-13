import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alerts.css'; // Optional: Add some styling for alerts

const ITEMS_PER_PAGE = 4;
const colorOptions = ['#D9E8FC', '#FFEADD', '#FFD8F4', '#FDE99D', '#B0E9CA', '#FFDBE4', '#FCFAD9'];

const AlertsPage = ({ user }) => {
  const [reminders, setReminders] = useState([]);
  const [content, setContent] = useState('');
  const [reminderPage, setReminderPage] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [alertContent, setAlertContent] = useState('');
  const [alertTime, setAlertTime] = useState('');

  

  useEffect(() => {
    if (user) {
      // Fetch reminders
      axios.get('http://localhost:5000/api/reminders', {
        headers: {
          Authorization: `Bearer ${user.uid}`,
        },
      })
      .then(res => {
        const allReminders = res.data;
        const remindersWithColors = allReminders.map(reminder => ({
          ...reminder,
          color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        }));
        setReminders(remindersWithColors);
      })
      .catch(err => console.error('Error fetching reminders:', err));

      // Fetch alerts
      axios.get('http://localhost:5000/api/alerts', {
        headers: { Authorization: `Bearer ${user.uid}` },
      })
      .then(res => {
        const fetchedAlerts = res.data;
        setAlerts(fetchedAlerts);
      })
      .catch(err => console.error('Error fetching alerts:', err));
    }
  }, [user]);

  // Countdown timer logic for alerts
  useEffect(() => {
    const timer = setInterval(() => {
      const updatedAlerts = alerts.map(alert => {
        const remainingTime = Math.max(0, new Date(alert.time).getTime() - Date.now());
        if (remainingTime <= 0) {
          handleRemoveAlert(alert._id); // Automatically remove when time reaches zero
        }
        return { ...alert, remainingTime };
      });
      setAlerts(updatedAlerts);
    }, 1000); // Update every second
  
    return () => clearInterval(timer); // Cleanup the interval on component unmount
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);
  

  const formatRemainingTime = (remainingTime) => {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle reminder creation
  const handleAddReminder = async (e) => {
    e.preventDefault();
    const newReminder = { content, time: new Date().toISOString() };
    try {
      const res = await axios.post('http://localhost:5000/api/reminders', newReminder, {
        headers: { Authorization: `Bearer ${user.uid}` },
      });
      setReminders([...reminders, res.data]);
      setContent(''); // Reset input
    } catch (err) {
      console.error('Error adding reminder:', err);
    }
  };

  // Handle alert creation
  const handleAddAlert = async (e) => {
    e.preventDefault();
    try {
      const newAlert = { content: alertContent, time: new Date(Date.now() + alertTime * 60000).toISOString() }; // Time set based on user input
      const headers = { Authorization: `Bearer ${user.uid}` };
      const response = await axios.post('http://localhost:5000/api/alerts', newAlert, { headers });
      setAlerts([...alerts, response.data]); // Update state with new alert
      setAlertContent('');
      setAlertTime('');
    } catch (error) {
      console.error('Error adding alert:', error.response?.data || error.message);
    }
  };

  // Handle reminder dismissal
  const handleDismissReminder = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/reminders/${id}`, { dismissed: true }, {
        headers: { Authorization: `Bearer ${user.uid}` },
      });
      setReminders(reminders.filter(reminder => reminder._id !== id));
    } catch (err) {
      console.error('Error dismissing reminder:', err);
    }
  };

  // Handle alert removal
  const handleRemoveAlert = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/alerts/${id}`, {
        headers: { Authorization: `Bearer ${user.uid}` },
      });
      setAlerts(alerts.filter(alert => alert._id !== id));
    } catch (error) {
      console.error('Error removing alert:', error.response?.data || error.message);
    }
  };

  // Pagination for reminders
  const handleNext = () => {
    if ((reminderPage + 1) * ITEMS_PER_PAGE < reminders.length) {
      setReminderPage(reminderPage + 1);
    }
  };

  const handlePrev = () => {
    if (reminderPage > 0) {
      setReminderPage(reminderPage - 1);
    }
  };

  return (
    <div className="alerts-page">
      {/* Reminders Section */}
      <h2 className="folder-title">
        <span role="img" aria-label="Reminders">⏰</span> Reminders
      </h2>
      <div className="folder reminder-folder">
        <button onClick={handlePrev} disabled={reminderPage === 0} className="arrow-button">{"<"}</button>
        <div className="carousel-container">
          <div className="reminders-carousel">
            {reminders.slice(reminderPage * ITEMS_PER_PAGE, (reminderPage + 1) * ITEMS_PER_PAGE).map(reminder => (
              !reminder.dismissed && (
                <div key={reminder._id} className="reminder-card" style={{ backgroundColor: reminder.color }}>
                  <h3>{reminder.content}</h3>
                  <button className="dismiss-button" onClick={() => handleDismissReminder(reminder._id)}>Dismiss</button>
                </div>
              )
            ))}
          </div>
        </div>
        <button onClick={handleNext} disabled={(reminderPage + 1) * ITEMS_PER_PAGE >= reminders.length} className="arrow-button">{">"}</button>
      </div>

      {/* Input form for adding new reminders */}
      <form className="add-reminder-form" onSubmit={handleAddReminder}>
        <input
          type="text"
          placeholder="New reminder content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Reminder</button>
      </form>

      {/* Alerts Section */}
      <div className="alerts-section">
        <h2>Alerts</h2>
        <form onSubmit={handleAddAlert} className="alert-form">
          <input
            type="text"
            placeholder="Alert content"
            value={alertContent}
            onChange={(e) => setAlertContent(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Time in minutes"
            value={alertTime}
            onChange={(e) => setAlertTime(e.target.value)}
            required
          />
          <button type="submit">Add Alert</button>
        </form>
        <div className="alerts-list">
          {alerts.map(alert => (
            <div key={alert._id} className="alert-card">
              <button className="remove-button" onClick={() => handleRemoveAlert(alert._id)}>x</button>
              <p>{alert.content}</p>
              <span>{formatRemainingTime(alert.remainingTime)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
