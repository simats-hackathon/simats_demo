import React, { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import Compare from './pages/Compare';
import Report from './pages/Report';
import mockProfiles from './data/mockProfiles';
import './index.css';

const tabs = ['Overview', 'Analytics', 'AI Insights', 'Compare', 'Report'];

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedProfile, setSelectedProfile] = useState(mockProfiles[0].username);

  const profile = useMemo(
    () => mockProfiles.find((item) => item.username === selectedProfile) || mockProfiles[0],
    [selectedProfile]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-slate-500">AI Instagram Business Profile Data</div>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{activeTab}</h1>
            </div>
           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-600">Mock profiles</label>
    <select
      value={selectedProfile}
      onChange={(e) => setSelectedProfile(e.target.value)}
      className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
    >
      {mockProfiles.map((item) => (
        <option key={item.username} value={item.username}>
          {item.displayName}
        </option>
      ))}
    </select>
  </div>
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-600">Or enter Instagram URL</label>
    <input
      type="text"
      placeholder="e.g., @username or instagram.com/username"
      className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
    />
  </div>
</div>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-slate-50 p-4 shadow-inner shadow-slate-100 sm:p-6">
            {activeTab === 'Overview' && <Overview profile={profile} />}
            {activeTab === 'Analytics' && <Analytics profile={profile} />}
            {activeTab === 'AI Insights' && <AIInsights profile={profile} />}
            {activeTab === 'Compare' && <Compare profiles={mockProfiles} />}
            {activeTab === 'Report' && <Report profile={profile} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;