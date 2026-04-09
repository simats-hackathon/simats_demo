import React, { useMemo, useState } from 'react';

const Compare = ({ profiles }) => {
  const [profileA, setProfileA] = useState(profiles[0].username);
  const [profileB, setProfileB] = useState(profiles[1].username);

  const selectedA = useMemo(() => profiles.find((item) => item.username === profileA), [profileA, profiles]);
  const selectedB = useMemo(() => profiles.find((item) => item.username === profileB), [profileB, profiles]);

  const scoreA = selectedA.avg_likes + selectedA.avg_comments;
  const scoreB = selectedB.avg_likes + selectedB.avg_comments;
  const winner = scoreA >= scoreB ? selectedA.displayName : selectedB.displayName;
  const explanation = `${winner} is currently leading due to stronger content engagement and more consistent audience response.`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: 'Profile A', value: profileA, setter: setProfileA },
          { label: 'Profile B', value: profileB, setter: setProfileB },
        ].map((selector) => (
          <div key={selector.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-400">{selector.label}</div>
            <select
              value={selector.value}
              onChange={(e) => selector.setter(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-500 focus:outline-none"
            >
              {profiles.map((profile) => (
                <option key={profile.username} value={profile.username}>
                  {profile.displayName}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Comparison Summary</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{winner} is currently stronger</div>
          </div>
        </div>
        <p className="text-slate-700">{explanation}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {[selectedA, selectedB].map((profile) => (
          <div
            key={profile.username}
            className={`rounded-3xl border p-6 shadow-sm ${
              profile.displayName === winner ? 'border-emerald-400/40 bg-emerald-50' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{profile.displayName}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{profile.businessCategory}</div>
              </div>
              {profile.displayName === winner && (
                <div className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">Winner</div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Followers</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{profile.followers.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Avg Likes</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{profile.avg_likes.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Avg Comments</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{profile.avg_comments.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Interest</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{profile.interestLevel}</div>
              </div>
            </div>
          </div>
        ))}
      </divitems-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Comparison Summary</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{winner} is currently stronger</div>
          </div>
        </div>
        <p className="text-slate-700">{explanation}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {[selectedA, selectedB].map((profile) => (
          <div
            key={profile.username}
            className={`rounded-3xl border p-6 shadow-sm ${
              profile.displayName === winner ? 'border-emerald-400/40 bg-emerald-50' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{profile.displayName}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{profile.businessCategory}</div>
              </div>
              {profile.displayName === winner && (
                <div className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">Winner</div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Followers</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{profile.followers.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Avg Likes</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{profile.avg_likes.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Avg Comments</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{profile.avg_comments.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Interest</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">{profile.interestLevel}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;