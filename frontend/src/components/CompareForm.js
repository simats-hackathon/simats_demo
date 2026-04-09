import React, { useState } from 'react';

const CompareForm = ({ onCompare }) => {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username1 && username2) {
      onCompare(username1, username2);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={username1}
          onChange={(e) => setUsername1(e.target.value)}
          placeholder="First username"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={username2}
          onChange={(e) => setUsername2(e.target.value)}
          placeholder="Second username"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Compare
      </button>
    </form>
  );
};

export default CompareForm;