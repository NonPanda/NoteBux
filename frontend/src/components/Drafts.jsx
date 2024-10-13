import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Drafts.css'; // Optional: Add some styling for folders

const ITEMS_PER_PAGE = 4; // Number of drafts shown per "page" in the carousel

const DraftsPage = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  const [favouriteDrafts, setFavouriteDrafts] = useState([]);
  const [recentDrafts, setRecentDrafts] = useState([]);
  const colorOptions = ['#D9E8FC', '#FFEADD', '#FFD8F4', '#FDE99D', '#B0E9CA', '#FFDBE4', '#FCFAD9'];

  // Pagination state for favourites and recent drafts
  const [favPage, setFavPage] = useState(0);
  const [recentPage, setRecentPage] = useState(0);

  useEffect(() => {
    if (user) {
      // Fetch all drafts
      axios
        .get('http://localhost:5000/api/drafts', {
          headers: {
            Authorization: `Bearer ${user.uid}`,
          },
        })
        .then((res) => {
          const allDrafts = res.data;

          // Assign random colors to each draft
          const draftsWithColors = allDrafts.map((draft) => ({
            ...draft,
            color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
          }));

          // Sort drafts by updatedAt for both recent and favourite lists
          const sortedDrafts = draftsWithColors.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );

          // Filter and sort favourite drafts by updatedAt
          const favDrafts = sortedDrafts.filter((draft) => draft.favourited);
          setFavouriteDrafts(favDrafts);

          // Set sorted drafts for the recent list
          setRecentDrafts(sortedDrafts);
        })
        .catch((err) => console.error('Error fetching drafts:', err));
    }
  }, [user]);

  // Handle navigation for favourites
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

  // Handle navigation for recent
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
      <h2 className="folder-title">
        <span role="img" aria-label="Favorites">
          ❤️
        </span>{' '}
        Favorites
      </h2>
      <div className="folder favourites-folder">
        <button onClick={handleFavPrev} disabled={favPage === 0} className="arrow-button">
          {'<'}
        </button>
        <div className="carousel-container">
          <div className="drafts-carousel">
            {favouriteDrafts
              .slice(favPage * ITEMS_PER_PAGE, (favPage + 1) * ITEMS_PER_PAGE)
              .map((draft) => (
                <div
                  key={draft._id}
                  className="draft-card"
                  style={{ backgroundColor: draft.color }}
                >
                  {/* Apply color here */}
                  <h3>{draft.title}</h3>
                  <div
                    className="draft-content-preview"
                    dangerouslySetInnerHTML={{ __html: draft.content.substring(0, 100) }}
                  />
                  {/* Show a preview */}
                </div>
              ))}
          </div>
        </div>
        <button
          onClick={handleFavNext}
          disabled={(favPage + 1) * ITEMS_PER_PAGE >= favouriteDrafts.length}
          className="arrow-button"
        >
          {'>'}
        </button>
      </div>

      <h2 className="folder-title">
        <span role="img" aria-label="Recent">
          ⏰
        </span>{' '}
        Recent
      </h2>
      <div className="folder recent-folder">
        <button onClick={handleRecentPrev} disabled={recentPage === 0} className="arrow-button">
          {'<'}
        </button>
        <div className="carousel-container">
          <div className="drafts-carousel">
            {recentDrafts
              .slice(recentPage * ITEMS_PER_PAGE, (recentPage + 1) * ITEMS_PER_PAGE)
              .map((draft) => (
                <div
                  key={draft._id}
                  className="draft-card"
                  style={{ backgroundColor: draft.color }}
                >
                  {/* Apply color here */}
                  <h3>{draft.title}</h3>
                  <div
                    className="draft-content-preview"
                    dangerouslySetInnerHTML={{ __html: draft.content.substring(0, 100) }}
                  />
                  {/* Show a preview */}
                </div>
              ))}
          </div>
        </div>
        <button
          onClick={handleRecentNext}
          disabled={(recentPage + 1) * ITEMS_PER_PAGE >= recentDrafts.length}
          className="arrow-button"
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default DraftsPage;
