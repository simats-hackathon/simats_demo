import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputForm from '../components/InputForm';
import Dashboard from '../components/Dashboard';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (input) => {
    setLoading(true);
    setError('');
    try {
      // Construct full URL if input is just username
      const url = input.startsWith('http') ? input : `https://www.instagram.com/${input}/`;
      
      const response = await fetch('http://localhost:5000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze profile');
      }
      
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
        <h1 className="text-3xl font-bold">AI Instagram Lead Intelligence</h1>
        <Link to="/compare" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          Compare Profiles
        </Link>
      </div>

      <InputForm onAnalyze={handleAnalyze} />

      {loading && <p className="text-center">Analyzing...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <Dashboard data={data} />
    </div>
  );
};

export default Home;