import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './CreatePage.css';
import StickyToolbar from './Blackbox';

const CreatePage = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const draftToEdit = location.state?.draft;

  // State initialization
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

  const handleSave = async () => {
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

      navigate('/create', {state: {draft: data}});
    } catch (error) {
      console.error('Error creating or updating draft:', error.response?.data || error.message);
    }
  };

  return (
    <div className="create-page-container">
      <div className="header">
        <h1>{draftToEdit ? 'Edit Draft' : 'Create Draft'}</h1>
      </div>
      <StickyToolbar
        onSave={handleSave}
        onToggleFavourite={() => setFavourited((prev) => !prev)}
        onSetDaily={() => setDaily(true)}
        favourited={favourited} // Pass current favourited state
      />
      <form onSubmit={handleSave} className="editor-form">
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
        <div className="button-container">
          <button type="submit" className="submit-btn">
            {draftToEdit ? 'Update Draft' : 'Create Draft'}
          </button>
        </div>
      </form>
      <footer className="footer">
        <div className="page-indicator">1/1</div>
        <button className="info-button" title="Information">
          ℹ️
        </button>

      </footer>
    </div>
  );
};

export default CreatePage;
