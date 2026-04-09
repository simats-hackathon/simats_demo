import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CompareForm from '../components/CompareForm';
import CompareResult from '../components/CompareResult';

const Compare = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (username1, username2) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/compare/${username1}/${username2}`);
      if (!response.ok) throw new Error('Profiles not found');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Compare Instagram Profiles</h1>
        <Link to="/" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          Back to Analysis
        </Link>
      </div>

      <CompareForm onCompare={handleCompare} />

      {loading && <p className="text-center">Comparing...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <CompareResult data={data} />
    </div>
  );
};

export default Compare;