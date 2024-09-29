import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchPage = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/drafts', {
        headers: {
          Authorization: `Bearer ${user.uid}`  
        }
      })
        .then(res => setDrafts(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div>
      <h1>Your Drafts</h1>
      {drafts.length > 0 ? (
        drafts.map(draft => (
          <div key={draft._id} className="draft">
            <h3>{draft.title}</h3>
            <p>{draft.content}</p>
          </div>
        ))
      ) : (
        <p>No drafts found.</p>
      )}
    </div>
  );
};

export default SearchPage;
