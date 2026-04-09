import React from 'react';

const Report = ({ profile }) => {
  const handleDownload = () => {
    window.alert('Download simulated PDF report.');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Report Summary</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{profile.displayName} Business Intelligence</div>
          </div>
          <button
            onClick={handleDownload}
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Interest Level</div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">{profile.interestLevel}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Business Type</div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">{profile.businessType}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Audience Type</div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">{profile.audienceType}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-base font-semibold text-slate-900">Business Summary</div>
          <p className="text-slate-700">{profile.businessDescription}</p>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-base font-semibold text-slate-900">Recommended Action</div>
          <p className="text-slate-700">{profile.recommendedAction}</p>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-base font-semibold text-slate-900">Key Insights</div>
          <ul className="space-y-3 text-slate-700">
            {profile.keyInsights.map((insight) => (
              <li key={insight} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-base font-semibold text-slate-900">Content Strategy</div>
          <p className="text-slate-700">{profile.contentStrategy}</p>
        </section>
      </div>
    </div>
  );
};

export default Report;
