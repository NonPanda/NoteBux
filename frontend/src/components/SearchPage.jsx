import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import './SearchPage.css';
import leftArrow from '../assets/icons/arrow-left.svg';
import rightArrow from '../assets/icons/arrow-right.svg';

const colorOptions = ['#D9E8FC', '#FFEADD', '#FFD8F4', '#FDE99D', '#B0E9CA', '#FFDBE4', '#FCFAD9'];

const SearchPage = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default category
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleDates, setVisibleDates] = useState([]);
  const daysInWeek = 7;

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/drafts`, {
        headers: {
          Authorization: `Bearer ${user.uid}`,
        },
      })
      .then(res => {
        const draftsWithColors = res.data.map(draft => ({
          ...draft,
          color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        }));
        setDrafts(draftsWithColors);
        const uniqueCategories = new Set(draftsWithColors.map(draft => draft.category));
        setCategories(["All", ...Array.from(uniqueCategories)]); 
      })
      .catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
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
    setSearchTerm(e.target.value); 
  };

  const filteredDrafts = drafts.filter(draft => {
    const draftDate = new Date(draft.createdAt).toDateString();
    const selectedDateString = selectedDate.toDateString();
    const matchesDate = draftDate === selectedDateString;
    const matchesSearchTerm = draft.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || draft.category === selectedCategory;

    return matchesDate && matchesSearchTerm && matchesCategory;
  });

  return (
    <div>
      {/* Category Filter */}
      <div className="category-filter">
        <select onChange={e => setSelectedCategory(e.target.value)} value={selectedCategory}>
          {categories.map(category => 
            <option key={category} value={category}>{category}</option>
          )}
        </select>
      </div>

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
        <img className="arrow-button" onClick={handlePrevWeek} src={leftArrow} alt='leftarrow' />
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
        <img className="arrow-button" onClick={handleNextWeek} src={rightArrow} alt='rightarrow' />
      </div>

      <hr className="mx-auto" style={{ width: '65%' }} />

      {filteredDrafts.length > 0 ? (
        <div className="drafts-container">
          {filteredDrafts.map(draft => (
            <Link key={draft._id} to={`/edit-draft/${draft._id}`}> {/* Navigate to edit page */}
              <div className="draft-card" style={{ backgroundColor: draft.color }}>
                <h3 className='text-center'>{draft.title}</h3>
                <p>{draft.content}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No drafts found for this date.</p>
      )}
    </div>
  );
};

export default SearchPage;
