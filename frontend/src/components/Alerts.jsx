import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alerts.css'; // Optional: Add some styling for alerts

const ITEMS_PER_PAGE = 4; // Number of reminders shown per "page" in the carousel
const colorOptions = ['#D9E8FC', '#FFEADD', '#FFD8F4', '#FDE99D', '#B0E9CA', '#FFDBE4', '#FCFAD9'];

const AlertsPage = ({ user }) => {
  const [reminders, setReminders] = useState([]);
  const [content, setContent] = useState('');
  const [reminderPage, setReminderPage] = useState(0);

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
          // Assign random colors to each reminder
          const remindersWithColors = allReminders.map(reminder => ({
            ...reminder,
            color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
          }));
          setReminders(remindersWithColors);
        })
        .catch(err => console.error('Error fetching reminders:', err));
    }
  }, [user]);

  // Handle reminder creation
  const handleAddReminder = async (e) => {
    e.preventDefault();
    const newReminder = { content, time: new Date().toISOString() }; // Set time automatically
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
    </div>
  );
};

export default AlertsPage;
