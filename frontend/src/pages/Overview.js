import React from 'react';

const statCards = [
  { label: 'Lead Source', value: 'Web Form' },
  { label: 'Business Category', value: 'B2C – Beauty Brand' },
];

const Overview = ({ profile }) => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 xl:grid-cols-[1.9fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{card.label}</div>
              <div className="mt-4 text-xl font-semibold text-slate-900">{card.value}</div>
            </div>
          ))}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Interest Level</div>
            <div className="mt-4 flex items-center gap-2 text-3xl font-semibold">
              <span>{profile.interestLevel}</span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  profile.interestLevel === 'High'
                    ? 'bg-emerald-100 text-emerald-700'
                    : profile.interestLevel === 'Medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {profile.interestLevel}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Recommended Action</div>
            <div className="mt-4 text-lg font-semibold text-slate-900">{profile.recommendedAction}</div>
          </div>
        </div>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Business Type</div>
          <div className="text-2xl font-semibold text-slate-900">{profile.businessType}</div>

          <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Audience Type</div>
          <div className="text-2xl font-semibold text-slate-900">{profile.audienceType}</div>

          <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Top Tags</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5 text-sm uppercase tracking-[0.24em] text-slate-400">Business Description</div>
          <p className="text-slate-700">{profile.businessDescription}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-3 text-sm uppercase tracking-[0.24em] text-slate-400">Key Insights</div>
              <ul className="space-y-3 text-slate-700">
                {profile.keyInsights.map((insight) => (
                  <li key={insight} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-3 text-sm uppercase tracking-[0.24em] text-slate-400">Strengths</div>
              <ul className="space-y-3 text-slate-700">
                {profile.strengths.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5 text-sm uppercase tracking-[0.24em] text-slate-400">Weaknesses</div>
          <ul className="space-y-4 text-slate-700">
            {profile.weaknesses.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 p-4">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
