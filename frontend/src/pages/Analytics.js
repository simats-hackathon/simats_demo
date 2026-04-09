import React from 'react';

const ChartCard = ({ title, data, accent }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <div className={`text-sm font-semibold text-${accent}-600`}>Live</div>
    </div>
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100">
            <div className={`h-3 rounded-full bg-${accent}-500`} style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Analytics = ({ profile }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Engagement vs Posts" data={profile.chartData.engagementVsPosts} accent="emerald" />
        <ChartCard title="Likes Distribution" data={profile.chartData.likesDistribution} accent="sky" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Posting Time vs Performance" data={profile.chartData.postingTimes} accent="violet" />
        <ChartCard title="Content Type Comparison" data={profile.chartData.contentTypeComparison} accent="amber" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 text-base font-semibold text-slate-900">Performance Summary</div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Followers</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">{profile.followers.toLocaleString()}</div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Avg Likes</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">{profile.avg_likes.toLocaleString()}</div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Avg Comments</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">{profile.avg_comments.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
