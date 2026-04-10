import React from 'react';

const FetchedDetails = ({ profile }) => {
  if (!profile.fetchedDetails) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Fetched Details</div>
        <p className="mt-4 text-slate-700">
          No scraped details yet. Enter an Instagram profile URL and click Analyze to populate this tab.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-5 text-sm uppercase tracking-[0.24em] text-slate-400">Fetched Details</div>
      <div className="grid gap-4 text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
        <p><span className="font-semibold text-slate-900">Source:</span> {profile.fetchedDetails.source}</p>
        <p><span className="font-semibold text-slate-900">Fetched Username:</span> {profile.fetchedDetails.fetchedUsername || 'N/A'}</p>
        <p><span className="font-semibold text-slate-900">Posts Fetched:</span> {profile.fetchedDetails.postsFetched}</p>
        <p><span className="font-semibold text-slate-900">Followers:</span> {profile.fetchedDetails.followersFromScrape.toLocaleString()}</p>
        <p><span className="font-semibold text-slate-900">Avg Likes:</span> {profile.fetchedDetails.avgLikes.toLocaleString()}</p>
        <p><span className="font-semibold text-slate-900">Avg Comments:</span> {profile.fetchedDetails.avgComments.toLocaleString()}</p>
        <p><span className="font-semibold text-slate-900">Engagement Rate:</span> {profile.fetchedDetails.engagementRate}%</p>
        <p className="sm:col-span-2 lg:col-span-3 break-all"><span className="font-semibold text-slate-900">Input URL:</span> {profile.fetchedDetails.inputUrl || 'N/A'}</p>
        <p className="sm:col-span-2 lg:col-span-3"><span className="font-semibold text-slate-900">Fetched At:</span> {new Date(profile.fetchedDetails.fetchedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FetchedDetails;
