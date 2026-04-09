import React from 'react';

const CompareResult = ({ data }) => {
  if (!data) return null;

  const { profile1, profile2, difference, explanation } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{profile1.username}</h3>
        <p><strong>Followers:</strong> {profile1.followers.toLocaleString()}</p>
        <p><strong>Engagement Rate:</strong> {profile1.engagementRate}%</p>
        <p><strong>Lead Score:</strong> <span className={profile1.leadScore === 'High' ? 'text-green-600' : profile1.leadScore === 'Medium' ? 'text-yellow-600' : 'text-red-600'}>{profile1.leadScore}</span></p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{profile2.username}</h3>
        <p><strong>Followers:</strong> {profile2.followers.toLocaleString()}</p>
        <p><strong>Engagement Rate:</strong> {profile2.engagementRate}%</p>
        <p><strong>Lead Score:</strong> <span className={profile2.leadScore === 'High' ? 'text-green-600' : profile2.leadScore === 'Medium' ? 'text-yellow-600' : 'text-red-600'}>{profile2.leadScore}</span></p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
        <h3 className="text-xl font-semibold mb-4">Comparison</h3>
        <p><strong>Engagement Difference:</strong> {difference}%</p>
        <p><strong>AI Explanation:</strong> {explanation}</p>
      </div>
    </div>
  );
};

export default CompareResult;