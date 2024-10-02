import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchPage.css';
import leftArrow from '../assets/icons/arrow-left.svg';
import rightArrow from '../assets/icons/arrow-right.svg';

const colorOptions = ['#D9E8FC', '#FFEADD', '#FFD8F4', '#FDE99D', '#B0E9CA', '#FFDBE4', '#FCFAD9'];
const SearchPage = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering drafts
  const [selectedDate, setSelectedDate] = useState(new Date()); // Today's date
  const [visibleDates, setVisibleDates] = useState([]);
  const daysInWeek = 7; // Show a week's worth of dates

  useEffect(() => {
    if (user) {
      // Fetch drafts for the selected date
      axios.get(`http://localhost:5000/api/drafts?date=${selectedDate.toISOString()}`, {
        headers: {
          Authorization: `Bearer ${user.uid}`
        }
      })
         .then(res => {
          // Assign a random color from the set to each draft
          const draftsWithColors = res.data.map(draft => ({
            ...draft,
            color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
          }));
          setDrafts(draftsWithColors);
        })
        .catch(err => console.error(err));
    }
  }, [user, selectedDate]);
   

  useEffect(() => {
    // Generate visible dates (a week view based on today's date)
    const dates = [];
    const today = new Date();
    for (let i = 0; i < daysInWeek; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setVisibleDates(dates);
  }, []);

  const handlePrevWeek = () => {
    const newDates = visibleDates.map(date => new Date(date.setDate(date.getDate() - daysInWeek)));
    setVisibleDates(newDates);
  };

  const handleNextWeek = () => {
    const newDates = visibleDates.map(date => new Date(date.setDate(date.getDate() + daysInWeek)));
    setVisibleDates(newDates);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term when user types in search bar
  };

 
  // Filter drafts based on search term and createdAt date
  const filteredDrafts = drafts.filter(draft => {
    const draftDate = new Date(draft.createdAt).toDateString();
    const selectedDateString = selectedDate.toDateString();
    return draftDate === selectedDateString && draft.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      {/* Search bar */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for notes"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="date-navigation mt-5">
        <img className="arrow-button" onClick={handlePrevWeek} src={leftArrow} alt='leftarrow'></img>
        <div className="dates-container">
          {visibleDates.map((date, index) => (
            <button
              key={index}
              className={`date-button ${selectedDate.toDateString() === date.toDateString() ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="month">{date.toLocaleString('default', { month: 'short' })}</div>
              <div className="day-number">{date.getDate()}</div>
              <div className="day-name">{date.toLocaleDateString('default', { weekday: 'short' })}</div>
            </button>
          ))}
        </div>
        <img className="arrow-button" onClick={handleNextWeek} src={rightArrow} alt='rightarrow'></img>
      </div>
      <hr className="mx-auto" style={{ width: '65%' }} />

      {filteredDrafts.length > 0 ? (
        <div className="drafts-container">
          {filteredDrafts.map(draft => (
            <div key={draft._id} className="draft-card" style={{ backgroundColor: draft.color }}>
              <h3 class='text-center'>{draft.title}</h3>
              <p>{draft.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No drafts found for this date.</p>
      )}
    </div>
  );
};

export default SearchPage;
