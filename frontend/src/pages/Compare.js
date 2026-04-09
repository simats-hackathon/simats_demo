import React, { useEffect, useMemo, useState } from 'react';

const Compare = ({ profiles }) => {
  const [profileA, setProfileA] = useState(profiles[0].username);
  const [profileB, setProfileB] = useState(profiles[1].username);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const profileIndex = useMemo(
    () =>
      profiles.reduce((acc, profile) => {
        acc[profile.username] = profile;
        return acc;
      }, {}),
    [profiles]
  );

  useEffect(() => {
    const loadComparison = async () => {
      if (!profileA || !profileB || profileA === profileB) {
        setComparison(null);
        setError(profileA === profileB ? 'Please select two different profiles.' : '');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:5000/api/profiles/compare/${profileA}/${profileB}`);
        if (!response.ok) {
          throw new Error('compare_failed');
        }

        const data = await response.json();
        setComparison(data);
      } catch (fetchError) {
        setComparison(null);
        setError('Unable to load comparison right now.');
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, [profileA, profileB]);

  const selectedA = comparison?.profile1 || null;
  const selectedB = comparison?.profile2 || null;

  const displayNameA = selectedA
    ? profileIndex[selectedA.username]?.displayName || selectedA.username
    : '';
  const displayNameB = selectedB
    ? profileIndex[selectedB.username]?.displayName || selectedB.username
    : '';

  const scoreA = selectedA ? Number(selectedA.avg_likes || 0) + Number(selectedA.avg_comments || 0) : 0;
  const scoreB = selectedB ? Number(selectedB.avg_likes || 0) + Number(selectedB.avg_comments || 0) : 0;
  const winner = scoreA >= scoreB ? displayNameA : displayNameB;
  const explanation = comparison?.explanation || 'Comparison insights unavailable.';

  const cards = [
    { key: selectedA?.username || 'profile-a', profile: selectedA, displayName: displayNameA },
    { key: selectedB?.username || 'profile-b', profile: selectedB, displayName: displayNameB },
  ];

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

      {loading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">Loading comparison...</div>
      )}

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
      )}

      {!loading && !error && selectedA && selectedB && (
        <>
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
            {cards.map(({ key, profile, displayName }) => (
              <div
                key={key}
                className={`rounded-3xl border p-6 shadow-sm ${
                  displayName === winner ? 'border-emerald-400/40 bg-emerald-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{displayName}</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">
                      {profile.aiAnalysis?.businessCategory || 'General Creator'}
                    </div>
                  </div>
                  {displayName === winner && (
                    <div className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">Winner</div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Followers</div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">
                      {(Number(profile.followers) || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Avg Likes</div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">
                      {(Number(profile.avg_likes) || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Avg Comments</div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">
                      {(Number(profile.avg_comments) || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Engagement Rate</div>
                    <div className="mt-2 text-xl font-semibold text-slate-900">{profile.engagementRate}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Compare;