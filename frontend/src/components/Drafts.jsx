import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Drafts.css';
import { Link } from 'react-router-dom';
import LeftArrow from '../assets/icons/arrow-left.svg';
import RightArrow from '../assets/icons/arrow-right.svg';

const ITEMS_PER_PAGE = 3;

const DraftsPage = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  const [favouriteDrafts, setFavouriteDrafts] = useState([]);
  const [recentDrafts, setRecentDrafts] = useState([]);
  const [favPage, setFavPage] = useState(0);
  const [recentPage, setRecentPage] = useState(0);
  const colorOptions = ['#FDE99D', '#D9E8FC', '#FFD8F4', '#FFEADD', '#B0E9CA', '#FFDBE4'];

  useEffect(() => {
    if (user) {
      // Fetch all drafts
      axios
        .get('http://localhost:5000/api/drafts', {
          headers: { Authorization: `Bearer ${user.uid}` },
        })
        .then((res) => {
          const allDrafts = res.data;
          const draftsWithColors = allDrafts.map((draft) => ({
            ...draft,
            color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
          }));
          const sortedDrafts = draftsWithColors.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          const favDrafts = sortedDrafts.filter((draft) => draft.favourited);
          setFavouriteDrafts(favDrafts);
          setRecentDrafts(sortedDrafts);
        })
        .catch((err) => console.error('Error fetching drafts:', err));
    }
  }, [user]);

 
  const handleFavNext = () => {
    if ((favPage + 1) * ITEMS_PER_PAGE < favouriteDrafts.length) {
      setFavPage(favPage + 1);
    }
  };

  const handleFavPrev = () => {
    if (favPage > 0) {
      setFavPage(favPage - 1);
    }
  };

  const handleRecentNext = () => {
    if ((recentPage + 1) * ITEMS_PER_PAGE < recentDrafts.length) {
      setRecentPage(recentPage + 1);
    }
  };

  const handleRecentPrev = () => {
    if (recentPage > 0) {
      setRecentPage(recentPage - 1);
    }
  };

 

  return (
    <div className="drafts-page">
      <div className="main-rectangle">
        <h2 className="folder-title">
          <span role="img" aria-label="Favorites">❤️</span> Favorites
        </h2>
        <div className="folder favourites-folder">
          <button onClick={handleFavPrev} disabled={favPage === 0} className="arrow-button">
            <img src={LeftArrow} alt="Left Arrow" />
          </button>
          <div className="carousel-container">
            <div className="drafts-carousel">
              {favouriteDrafts
                .slice(favPage * ITEMS_PER_PAGE, (favPage + 1) * ITEMS_PER_PAGE)
                .map((draft) => (
                  <Link key={draft._id} to={`/create`} state={{ draft }}>
                    <div className="draft-card" style={{ backgroundColor: draft.color }}>
                      <h3 className="text-center">{draft.title}</h3>
                      <div className="draft-content-preview" dangerouslySetInnerHTML={{ __html: draft.content.substring(0, 100) }} />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          <button onClick={handleFavNext} disabled={(favPage + 1) * ITEMS_PER_PAGE >= favouriteDrafts.length} className="arrow-button">
            <img src={RightArrow} alt="Right Arrow" />
          </button>
        </div>
      </div>

      <div className="main-rectangle">
        <h2 className="folder-title">
          <span role="img" aria-label="Recent">⏰</span> Recent
        </h2>
        <div className="folder recent-folder">
          <button onClick={handleRecentPrev} disabled={recentPage === 0} className="arrow-button">
            <img src={LeftArrow} alt="Left Arrow" />
          </button>
          <div className="carousel-container">
            <div className="drafts-carousel">
              {recentDrafts
                .slice(recentPage * ITEMS_PER_PAGE, (recentPage + 1) * ITEMS_PER_PAGE)
                .map((draft) => (
                  <Link key={draft._id} to={`/create`} state={{ draft }}>
                    <div className="draft-card" style={{ backgroundColor: draft.color }}>
                      <h3 className="text-center">{draft.title}</h3>
                      <div className="draft-content-preview" dangerouslySetInnerHTML={{ __html: draft.content.substring(0, 100) }} />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          <button onClick={handleRecentNext} disabled={(recentPage + 1) * ITEMS_PER_PAGE >= recentDrafts.length} className="arrow-button">
            <img src={RightArrow} alt="Right Arrow" />
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default DraftsPage;
