import React from 'react';

const tabs = ['Overview', 'Analytics', 'AI Insights', 'Compare', 'Report'];

const Sidebar = ({ activeTab, setActiveTab, profile }) => {
  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-950 text-white lg:flex">
      <div className="flex h-20 items-center justify-center border-b border-slate-800 px-6 text-center">
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Instagram BI</div>
          <div className="mt-2 text-xl font-semibold">Profile Dashboard</div>
        </div>
      </div>

      <div className="flex-1 space-y-2 p-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="border-t border-slate-800 p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Current Profile</div>
        <div className="rounded-3xl bg-slate-900 p-4 text-sm">
          <div className="font-semibold text-white">{profile.displayName}</div>
          <div className="mt-2 text-slate-400">{profile.businessCategory}</div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">{profile.interestLevel} Interest</span>
            <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-200">{profile.audienceType}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
