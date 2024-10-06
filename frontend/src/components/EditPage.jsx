import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPage = ({ user }) => {
  const { id } = useParams(); // Get draft id from URL
  const navigate = useNavigate(); // For redirecting after save
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [favourited, setFavourited] = useState(false); // State for favourited status
  const [daily, setDaily] = useState(false); // State for daily status

  useEffect(() => {
    if (user) {
      // Fetch the single draft details by id
      axios.get(`http://localhost:5000/api/drafts/${id}`, {
        headers: {
          Authorization: `Bearer ${user.uid}`,
        },
      })
      .then(res => {
        const draft = res.data;

        // Debugging: Log the draft response to check the data format
        console.log("Fetched draft:", draft);

        // Check if the data is present and then set the state
        if (draft) {
          setTitle(draft.title || '');
          setContent(draft.content || '');
          setCategory(draft.category || '');
          setFavourited(draft.favourited || false); // Set the favourited status
          setDaily(draft.daily || false); // Set the daily status
        }
      })
      .catch(err => {
        console.error("Error fetching the draft:", err.response?.data || err.message);
      });
    }
  }, [user, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/drafts/${id}`,
        { title, content, category, favourited,daily }, // Include favourited status
        {
          headers: {
            Authorization: `Bearer ${user.uid}`,
          },
        }
      );
      navigate('/'); // Redirect to home page after successful update
    } catch (error) {
      console.error('Error updating draft:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={favourited}
            onChange={(e) => setFavourited(e.target.checked)} // Update favourited status
          />
          Favourite
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={daily}
            onChange={(e) => setDaily(e.target.checked)} 
          />
          Daily
        </label>
      </div>
      <button type="submit">Update Draft</button>
    </form>
  );
};

export default EditPage;
