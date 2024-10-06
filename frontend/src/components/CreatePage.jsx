import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation to get draft data

const CreatePage = ({ user }) => {
  const location = useLocation();
  const draftToEdit = location.state?.draft; // Get the draft from location.state

  const [title, setTitle] = useState(draftToEdit ? draftToEdit.title : '');
  const [content, setContent] = useState(draftToEdit ? draftToEdit.content : '');
  const [category, setCategory] = useState(draftToEdit ? draftToEdit.category : '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = { title, content, category };
      const headers = { Authorization: `Bearer ${user?.uid}` };
      
      if (draftToEdit) {
        // If there's an existing draft, update it
        const response = await axios.put(
          `http://localhost:5000/api/drafts/${draftToEdit._id}`,
          data,
          { headers }
        );
        console.log('Draft updated:', response.data);
      } else {
        // Otherwise, create a new draft
        const response = await axios.post(
          'http://localhost:5000/api/drafts/create',
          data,
          { headers }
        );
        console.log('Draft created:', response.data);
      }

      // Clear the fields after submission
      setTitle('');
      setContent('');
      setCategory('');
    } catch (error) {
      console.error('Error creating or updating draft:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">{draftToEdit ? 'Update Draft' : 'Create Draft'}</button>
    </form>
  );
};

export default CreatePage;
