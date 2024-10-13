import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './CreatePage.css';
import StickyToolbar from './Blackbox';

const CreatePage = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const draftToEdit = location.state?.draft; // Get draft from location state

  // State initialization based on whether it's edit or create mode
  const [title, setTitle] = useState(draftToEdit ? draftToEdit.title : '');
  const [content, setContent] = useState(draftToEdit ? draftToEdit.content : '');
  const [category, setCategory] = useState(draftToEdit ? draftToEdit.category : '');
  const [favourited, setFavourited] = useState(draftToEdit ? draftToEdit.favourited : false);
  const [daily, setDaily] = useState(draftToEdit ? draftToEdit.daily : false);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    // If in edit mode, populate the contentEditable with the draft content
    if (draftToEdit) {
      contentEditableRef.current.innerHTML = draftToEdit.content;
    }
  }, [draftToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = contentEditableRef.current.innerHTML;

    try {
      const data = { title, content, category, favourited, daily };
      const headers = { Authorization: `Bearer ${user?.uid}` };

      if (draftToEdit) {
        // Edit existing draft
        await axios.put(
          `http://localhost:5000/api/drafts/${draftToEdit._id}`,
          data,
          { headers }
        );
        console.log('Draft updated');
      } else {
        // Create a new draft
        await axios.post(
          'http://localhost:5000/api/drafts/create',
          data,
          { headers }
        );
        console.log('Draft created');
      }

      // Reset form fields after save
      setTitle('');
      contentEditableRef.current.innerHTML = '';
      setContent('');
      setCategory('');

      // Redirect to homepage or another page after save
      navigate('/');
    } catch (error) {
      console.error('Error creating or updating draft:', error.response?.data || error.message);
    }
  };

  return (
    <div className="create-page-container">
      <div className="header">
        <h1>{draftToEdit ? 'Edit Draft' : 'Create Draft'}</h1>
      </div>
      <StickyToolbar />
      <form onSubmit={handleSubmit} className="editor-form">
        <div className="title-container">
          <input
            type="text"
            className="title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="content-container">
          <div
            ref={contentEditableRef}
            className="content-input"
            contentEditable={true}
            placeholder="Start typing your content here..."
            dangerouslySetInnerHTML={{ __html: draftToEdit ? draftToEdit.content : '' }}
          />
        </div>
        <div className="category-container">
          <input
            type="text"
            className="category-input"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={favourited}
              onChange={(e) => setFavourited(e.target.checked)}
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
        <div className="button-container">
          <button type="submit" className="submit-btn">
            {draftToEdit ? 'Update Draft' : 'Create Draft'}
          </button>
        </div>
      </form>
      <footer className="footer">
        <div className="page-indicator">1/1</div>
        <button className="info-button" title="Information"></button>
      </footer>
    </div>
  );
};

export default CreatePage;
