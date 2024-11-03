import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment'; // For easier date manipulation
import './Alerts.css'; // Optional: Add some styling for alerts
import LeftArrow from '../assets/icons/arrow-left.svg';
import RightArrow from '../assets/icons/arrow-right.svg';
import Pin from '../assets/icons/create/pin.svg';
import Daily from '../assets/icons/create/alert.svg';

const ITEMS_PER_PAGE = 4;
const colorOptions= ['#FDE99D','#D9E8FC','#FFD8F4','#FFEADD','#B0E9CA','#FFDBE4'];

const AlertsPage = ({ user }) => {
  const [dailyDrafts, setDailyDrafts] = useState([]);
  const [dailyPage, setDailyPage] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [alertContent, setAlertContent] = useState('');
  const [alertTime, setAlertTime] = useState('');
  const [expiredAlert, setExpiredAlert] = useState('');

  useEffect(() => {
    if (user) {
      // Fetch daily drafts
      axios.get('http://localhost:5000/api/drafts', {
        headers: {
          Authorization: `Bearer ${user.uid}`,
        },
      })
      .then((res) => {
        const allDrafts = res.data;
        const dailyDrafts = allDrafts.filter(draft => draft.daily); // Only select drafts marked as daily
        const draftsWithColors = dailyDrafts.map(draft => ({
          ...draft,
          color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        }));
        setDailyDrafts(draftsWithColors);
      })
      .catch(err => console.error('Error fetching drafts:', err));

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
          handleRemoveAlert(alert._id, alert.content); // Automatically remove when time reaches zero
        }
        return { ...alert, remainingTime };
      });
      setAlerts(updatedAlerts);
    }, 1000); // Update every second
  
    return () => clearInterval(timer); // Cleanup the interval on component unmount
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);

  // Pagination for daily drafts
  const handleDailyNext = () => {
    if ((dailyPage + 1) * ITEMS_PER_PAGE < dailyDrafts.length) {
      setDailyPage(dailyPage + 1);
    }
  };

  const handleDailyPrev = () => {
    if (dailyPage > 0) {
      setDailyPage(dailyPage - 1);
    }
  };

  const handleAddAlert = (e) => {
    e.preventDefault();
    if (alertContent && alertTime) {
      const alertTimestamp = new Date(Date.now() + alertTime * 60000).toISOString(); // Convert minutes to timestamp
      axios.post('http://localhost:5000/api/alerts', {
        content: alertContent,
        time: alertTimestamp, // Store the future timestamp
        totalTime: alertTime, // Store the total time in minutes
      }, {
        headers: {
          Authorization: `Bearer ${user.uid}`,
        },
      })
      .then(res => {
        setAlerts([...alerts, { ...res.data, totalTime: alertTime }]); // Include totalTime in the alert object
        setAlertContent('');
        setAlertTime('');
      })
      .catch(err => console.error('Error adding alert:', err));
    }
  };

  const handleRemoveAlert = (id,content) => {
    axios.delete(`http://localhost:5000/api/alerts/${id}`, {
      headers: {
        Authorization: `Bearer ${user.uid}`,
      },
    })
  .then(() => {
    setAlerts(alerts.filter(alert => alert._id !== id));
    setExpiredAlert(`${content} has been dismissed`); // Set expired alert message
    setTimeout(() => setExpiredAlert(''), 5000); // Clear message after 5 seconds
  })
  .catch(err => console.error('Error removing alert:', err));
};

  const formatRemainingTime = (remainingTime) => {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const isUpdatedWithin24Hours = (updatedAt) => {
    const last24Hours = moment().subtract(24, 'hours');
    return moment(updatedAt).isAfter(last24Hours);
  };

  return (
    <div className="alerts-page">
      {/* Daily Drafts Section */}
      {expiredAlert && (
        <div style={{ backgroundColor: 'lightcoral', padding: '10px', textAlign: 'center' }}>
          {expiredAlert}
        </div>
      )}
      <div className="main-rectangle">
      <h2 className="folder-title">
        <span role="img" aria-label="Daily">
          <img src={Pin} alt="Daily" />
          
          </span> Daily Drafts
      </h2>
      <div className="folder daily-folder">
        <button onClick={handleDailyPrev} disabled={dailyPage === 0} className="arrow-button">
          <img src={LeftArrow } alt="Left Arrow" />
        </button>
        <div className="carousel-container">
          <div className="drafts-carousel">
            {dailyDrafts
              .slice(dailyPage * ITEMS_PER_PAGE, (dailyPage + 1) * ITEMS_PER_PAGE)
              .map((draft) => (
                <Link 
                  key={draft._id}
                  to={`/create`} 
                  state={{ draft }} // Pass draft data to the create page
                >
                 <div className="draft-card" 
  style={{ 
    backgroundColor: draft.color,
    position: 'relative',  // Position for green corner
  }}>
  
  <h3>{draft.title}</h3>
  <div
    className="draft-content-preview"
    dangerouslySetInnerHTML={{ __html: draft.content.substring(0, 100) }}
  />

  {/* Green corner if updated within 24 hours */}
  {isUpdatedWithin24Hours(draft.updatedAt) && (
    <div 
      className="green-corner"  // Apply specific class
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '20px',
        height: '20px',
        backgroundColor: 'green',
        clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
      }}
    />
  )}
</div>

                </Link>
              ))}
          </div>
        </div>
        <button
          onClick={handleDailyNext}
          disabled={(dailyPage + 1) * ITEMS_PER_PAGE >= dailyDrafts.length}
          className="arrow-button"
        >
          <img src={RightArrow} alt="Right Arrow" />
        </button>
      </div>
    </div>

      {/* Alerts Section */}
      <div className="main-rectangle">
  <h2 className="folder-title">
    <span role="img" aria-label="Alerts"></span>
    <img src={Daily} alt="Alerts" />      
       Alerts ({alerts.length})
  </h2>
  
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
  <div className="alerts-container"> {/* New container for styling */}
    <div className="alerts-list">
      {alerts.length === 0 && (<div>No alerts set</div>)}


      {alerts.map(alert => {
        const totalTimeInMilliseconds = alert.totalTime * 60000;
        const remainingTime = Math.max(0, new Date(alert.time).getTime() - Date.now());
        const remainingTimePercentage = (remainingTime / totalTimeInMilliseconds) * 100;

        let alertColor;
        if (remainingTimePercentage <= 30) {
          alertColor = '#D9614C'; // Red for less than 30%
        } else if (remainingTimePercentage <= 60) {
          alertColor = '#FFCC00'; // Yellow for 30% to 60%
        } else {
          alertColor = '#5C966C';
        }

        return (
          <div key={alert._id} className="alert-card">
            <button
              className="remove-button"
              onClick={() => handleRemoveAlert(alert._id)}
              style={{
                backgroundColor: alertColor,
                borderRadius: '4px',
                width: '25px',
                height: '25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                border: 'none',
              }}
            >
              ✕
            </button>
            
            <div className="alert-content">{alert.content}</div>
            
            <span
              className="timer-button"
              style={{
                backgroundColor: alertColor,
                padding: '8px 12px',
                borderRadius: '12px',
                color: '#fff',
              }}
            >
              {formatRemainingTime(remainingTime)}
            </span>
          </div>
        );
      })}
    </div>
  </div>
</div>

    </div>
  );
};

export default AlertsPage;
