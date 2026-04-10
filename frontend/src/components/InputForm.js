import React, { useState } from 'react';

const InputForm = ({ onAnalyze, selectedMockProfile = 'None' }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasUsername = username.trim().length > 0;
    const hasMockSelection = selectedMockProfile && selectedMockProfile !== 'None';

    if (!hasUsername && !hasMockSelection) {
      window.alert('Please enter a URL or select a mock profile');
      return;
    }

    onAnalyze(username.trim());
  };

  const disableAnalyze = username.trim().length === 0 && (!selectedMockProfile || selectedMockProfile === 'None');

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Instagram username or URL"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={disableAnalyze}
          className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Analyze
        </button>
      </div>
    </form>
  );
};

export default InputForm;