import React, { useState } from 'react';
import axios from 'axios';

const CreatePage = ({ user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/drafts/create',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${user?.uid}` 
          }
        }
      );
      console.log('Draft created:', response.data);
    } catch (error) {
      console.error('Error creating draft:', error.response.data);
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
      <button type="submit">Create Draft</button>
    </form>
  );
};

export default CreatePage;
