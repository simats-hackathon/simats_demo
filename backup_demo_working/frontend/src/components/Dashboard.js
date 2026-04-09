import React from 'react';

const Dashboard = ({ data }) => {
  if (!data) return null;

  const { username, followers, engagementRate, leadScore, tags, aiAnalysis } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Profile Summary</h3>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Followers:</strong> {followers.toLocaleString()}</p>
        <p><strong>Engagement Rate:</strong> {engagementRate}%</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Lead Score</h3>
        <div className={`text-4xl font-bold ${leadScore === 'High' ? 'text-green-600' : leadScore === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
          {leadScore}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Business Classification</h3>
        <p>{aiAnalysis.businessClassification}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
        <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
        <p>{aiAnalysis.keyInsights}</p>
        <p><strong>Growth Potential:</strong> {aiAnalysis.growthPotential}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md md:col-span-3">
        <h3 className="text-xl font-semibold mb-4">Recommended Action</h3>
        <p>{aiAnalysis.recommendedAction}</p>
      </div>
    </div>
  );
};

export default Dashboard;