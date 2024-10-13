import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alerts = ({ user }) => {
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    // Fetch existing alerts when the component mounts
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alerts', {
          headers: { Authorization: `Bearer ${user?.uid}` },
        });
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error.response?.data || error.message);
      }
    };

    fetchAlerts();
  }, [user]);

  const handleAddAlert = async (e) => {
    e.preventDefault();
    try {
      const newAlert = { content, time };
      const headers = { Authorization: `Bearer ${user?.uid}` };

      const response = await axios.post('http://localhost:5000/api/alerts', newAlert, { headers });
      setAlerts([...alerts, response.data]); // Update state with new alert
      setContent('');
      setTime('');
    } catch (error) {
      console.error('Error adding alert:', error.response?.data || error.message);
    }
  };

  const handleRemoveAlert = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/alerts/${id}`, {
        headers: { Authorization: `Bearer ${user?.uid}` },
      });
      setAlerts(alerts.filter(alert => alert._id !== id)); // Update state to remove alert
    } catch (error) {
      console.error('Error removing alert:', error.response?.data || error.message);
    }
  };

  return (
    <div className="alerts-section">
      <h2>Alerts</h2>

      {/* Input for adding a new alert */}
      <form onSubmit={handleAddAlert} className="alert-form">
        <input
          type="text"
          placeholder="Alert content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">Add Alert</button>
      </form>

      {/* Alerts list */}
      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert._id} className="alert-card">
            <button className="remove-button" onClick={() => handleRemoveAlert(alert._id)}>x</button>
            <p>{alert.content}</p>
            <span>{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;

