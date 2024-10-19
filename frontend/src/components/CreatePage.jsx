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
  const [draftId, setDraftId] = useState(draftToEdit ? draftToEdit._id : null); // Keep draft ID separately
  const [title, setTitle] = useState(draftToEdit ? draftToEdit.title : '');
  const [content, setContent] = useState(draftToEdit ? draftToEdit.content : '');
  const [category, setCategory] = useState(draftToEdit ? draftToEdit.category : '');
  const [description, setDescription] = useState(draftToEdit ? draftToEdit.description : '');
  const [favourited, setFavourited] = useState(draftToEdit ? draftToEdit.favourited : false);
  const [daily, setDaily] = useState(draftToEdit ? draftToEdit.daily : false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // Alert state

  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (draftToEdit) {
      contentEditableRef.current.innerHTML = draftToEdit.content;
    }
  }, [draftToEdit]);

  const handleSave = async () => {
    const content = contentEditableRef.current.innerHTML;
    try {
      const data = { title, content, category, description, favourited, daily };
      const headers = { Authorization: `Bearer ${user?.uid}` };

      if (draftId) {  // Check if draftId is present
        await axios.put(
          `http://localhost:5000/api/drafts/${draftId}`,
          data,
          { headers }
        );
        showAlert('Draft updated successfully', 'success');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/drafts/create',
          data,
          { headers }
        );
        // After creating a draft, save its ID to prevent future PUT errors
        setDraftId(response.data._id);
        showAlert('Draft created successfully', 'success');
      }
    } catch (error) {
      showAlert('Error creating or updating draft', 'error');
      console.error('Error creating or updating draft:', error.response?.data || error.message);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000); // Automatically hide alert after 3 seconds
  };

  const handleClipboardClick = () => {
    const plainText = contentEditableRef.current.innerText;
    const textarea = document.createElement('textarea');
    textarea.value = plainText;
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      showAlert('Content copied to clipboard', 'success');
    } catch (err) {
      showAlert('Failed to copy content', 'error');
      console.error('Failed to copy content:', err);
    }

    document.body.removeChild(textarea);
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handlePopupSave = () => {
    closePopup(); // Close the popup after saving the data
  };

  return (
    <div className="create-page-container">
      {/* Alert component */}
      {alert.show && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <StickyToolbar
        onSave={handleSave}
        onToggleFavourite={() => setFavourited((prev) => !prev)}
        onSetDaily={() => setDaily((prev) => !prev)}
        favourited={favourited}
        onClipboardClick={handleClipboardClick}
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
        
      </form>
      <footer className="footer">
        <button className="info-button" title="Information" onClick={openPopup}>
          ℹ️
        </button>
      </footer>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Draft Information</h2>
            <div className="popup-row">
              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="popup-row">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={handlePopupSave}>Save</button>
              <button onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePage;
