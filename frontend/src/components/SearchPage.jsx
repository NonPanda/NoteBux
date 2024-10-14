import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import './SearchPage.css';
import leftArrow from '../assets/icons/arrow-left.svg';
import rightArrow from '../assets/icons/arrow-right.svg';

const colorOptions = ['#D9E8FC', '#FFEADD', '#FFD8F4', '#FDE99D', '#B0E9CA', '#FFDBE4', '#FCFAD9'];

const SearchPage = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default category
  const [searchTerm, setSearchTerm] = useState(''); // Controlled input search term
  const [triggeredSearchTerm, setTriggeredSearchTerm] = useState(''); // Actual search term triggered by Find button
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
        // Remove empty string categories and create the list of unique categories
        const uniqueCategories = new Set(
          draftsWithColors
            .map(draft => draft.category)
            .filter(category => category && category.trim() !== "")
        );
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
    const newDates = visibleDates.map((date) => new Date(date.setDate(date.getDate() - daysInWeek)));
    setVisibleDates(newDates);
  };

  const handleNextWeek = () => {
    const newDates = visibleDates.map((date) => new Date(date.setDate(date.getDate() + daysInWeek)));
    setVisibleDates(newDates);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the controlled input's search term
  };

  const handleFindClick = () => {
    setTriggeredSearchTerm(searchTerm); // Trigger the actual search term
  };

  const filteredDrafts = drafts.filter((draft) => {
    const draftDate = new Date(draft.createdAt).toDateString();
    const selectedDateString = selectedDate.toDateString();
    const matchesDate = draftDate === selectedDateString || triggeredSearchTerm; // Ignore date filter when search is triggered
    const matchesSearchTerm = draft.title.toLowerCase().includes(triggeredSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || draft.category === selectedCategory;

    return matchesDate && matchesSearchTerm && matchesCategory;
  });

  return (
    <div>
      {/* Date Navigation */}
      <div className="date-navigation mt-5">
        <img className="arrow-button" onClick={handlePrevWeek} src={leftArrow} alt="leftarrow" />
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
        <img className="arrow-button" onClick={handleNextWeek} src={rightArrow} alt="rightarrow" />
      </div>

      {/* Category Buttons */}
      <div className="category-buttons">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <hr className="mx-auto" style={{ width: '65%' }} />

      {/* Search bar with Find button */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for notes"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="find-button" onClick={handleFindClick}>Find</button>
      </div>

      {/* Drafts Display */}
      {filteredDrafts.length > 0 ? (
        <div className="drafts-container">
          {filteredDrafts.map((draft) => (
            <Link key={draft._id} to={`/create`} state={{ draft }}>
              <div className="draft-card" style={{ backgroundColor: draft.color }}>
                <h3 className="text-center">{draft.title}</h3>
                <div className="draft-content-preview" dangerouslySetInnerHTML={{ __html: draft.content.substring(0, 100) }} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default SearchPage;
