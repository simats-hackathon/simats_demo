import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import Compare from './pages/Compare';
import Report from './pages/Report';
import FetchedDetails from './pages/FetchedDetails';
import mockProfiles from './data/mockProfiles';
import './index.css';

const tabs = ['Overview', 'Analytics', 'AI Insights', 'Compare', 'Report', 'Fetched Details'];
const NONE_PROFILE = '__none__';

const normalizeList = (value, fallback) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => String(item)).filter(Boolean).slice(0, 4);
  }
  return fallback;
};

const formatDisplayName = (username) =>
  String(username || '')
    .replace(/_/g, ' ')
    .replace(/\./g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const extractUsername = (input) => {
  const raw = String(input || '').trim();
  if (!raw) return '';

  if (raw.includes('instagram.com') && !/^https?:\/\//i.test(raw)) {
    const normalized = raw.startsWith('www.') ? `https://${raw}` : `https://www.${raw}`;
    return extractUsername(normalized);
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();
      if (hostname !== 'instagram.com') {
        return '';
      }

      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        const candidate = parts[0].replace(/^@+/, '').toLowerCase();
        const reserved = new Set(['p', 'reel', 'reels', 'tv', 'stories', 'explore']);
        return reserved.has(candidate) ? '' : candidate;
      }

      return '';
    } catch (error) {
      return '';
    }
  }

  if (raw.includes('/')) {
    return '';
  }

  const cleaned = raw.replace(/^@+/, '').split('/')[0].trim();
  if (/^https?:/i.test(cleaned) || cleaned.includes('.')) {
    return '';
  }
  return cleaned.toLowerCase();
};

const buildInstagramUrl = (input) => {
  const raw = String(input || '').trim();
  if (!raw) return '';

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const username = extractUsername(raw);
  return username ? `https://www.instagram.com/${username}/` : '';
};

const mapApiToProfile = (apiData, baseProfile) => {
  const ai = apiData?.aiAnalysis || {};
  const growth = String(ai.growthPotential || '').toLowerCase();
  const interestLevel = growth.includes('high')
    ? 'High'
    : growth.includes('medium')
      ? 'Medium'
      : growth.includes('low')
        ? 'Low'
        : baseProfile.interestLevel;

  return {
    ...baseProfile,
    username: apiData.username || baseProfile.username,
    displayName: formatDisplayName(apiData.username || baseProfile.username) || baseProfile.displayName,
    followers: Number(apiData.followers) || baseProfile.followers,
    avg_likes: Number(apiData.avg_likes) || baseProfile.avg_likes,
    avg_comments: Number(apiData.avg_comments) || baseProfile.avg_comments,
    bio: apiData.bio || baseProfile.bio,
    tags: normalizeList(ai.tags || apiData.tags, baseProfile.tags),
    businessCategory: ai.businessCategory || baseProfile.businessCategory,
    businessType: ai.businessType || baseProfile.businessType,
    audienceType: ai.audienceType || baseProfile.audienceType,
    businessDescription: ai.description || baseProfile.businessDescription,
    keyInsights: normalizeList(ai.keyInsights, baseProfile.keyInsights),
    strengths: normalizeList(ai.strengths, baseProfile.strengths),
    weaknesses: normalizeList(ai.weaknesses, baseProfile.weaknesses),
    growthPotential: ai.growthPotential || baseProfile.growthPotential,
    interestLevel,
    recommendedAction: ai.recommendedAction || baseProfile.recommendedAction,
    competitorInsights: ai.competitorInsights || baseProfile.competitorInsights,
    contentStrategy: ai.contentStrategy || baseProfile.contentStrategy,
    hashtagRecommendations: normalizeList(ai.hashtagRecommendations, baseProfile.hashtagRecommendations),
    audienceBehavior: ai.audienceBehavior || baseProfile.audienceBehavior,
    whyThisWorks: normalizeList(ai.whyThisWorks, baseProfile.whyThisWorks || []),
    fetchedDetails: null,
  };
};

const mapScrapeToProfile = (scrapeData, baseProfile) => {
  const profileData = scrapeData?.profile || {};
  const metrics = scrapeData?.analysis || {};
  const ai = scrapeData?.aiAnalysis || {};
  const growth = String(ai.growthPotential || '').toLowerCase();
  const interestLevel = growth.includes('high')
    ? 'High'
    : growth.includes('medium')
      ? 'Medium'
      : growth.includes('low')
        ? 'Low'
        : baseProfile.interestLevel;

  return {
    ...baseProfile,
    username: profileData.username || baseProfile.username,
    displayName: formatDisplayName(profileData.username || baseProfile.username) || baseProfile.displayName,
    followers: Number(profileData.followers) || baseProfile.followers,
    avg_likes: Number(metrics.avgLikes) || baseProfile.avg_likes,
    avg_comments: Number(metrics.avgComments) || baseProfile.avg_comments,
    bio: profileData.bio || baseProfile.bio,
    tags: normalizeList(ai.tags || metrics.hashtags, baseProfile.tags),
    businessCategory: ai.businessCategory || baseProfile.businessCategory,
    businessType: ai.businessType || baseProfile.businessType,
    audienceType: ai.audienceType || baseProfile.audienceType,
    businessDescription: ai.description || baseProfile.businessDescription,
    keyInsights: normalizeList(ai.keyInsights, baseProfile.keyInsights),
    strengths: normalizeList(ai.strengths, baseProfile.strengths),
    weaknesses: normalizeList(ai.weaknesses, baseProfile.weaknesses),
    growthPotential: ai.growthPotential || baseProfile.growthPotential,
    interestLevel,
    recommendedAction: ai.recommendedAction || baseProfile.recommendedAction,
    competitorInsights: ai.competitorInsights || baseProfile.competitorInsights,
    contentStrategy: ai.contentStrategy || baseProfile.contentStrategy,
    hashtagRecommendations: normalizeList(ai.hashtagRecommendations, baseProfile.hashtagRecommendations),
    audienceBehavior: ai.audienceBehavior || baseProfile.audienceBehavior,
    whyThisWorks: normalizeList(ai.whyThisWorks, baseProfile.whyThisWorks || []),
    fetchedDetails: {
      source: scrapeData?.meta?.source || 'Apify Instagram Scraper',
      inputUrl: profileData?.sourceUrl || '',
      fetchedUsername: profileData?.username || '',
      postsFetched: Array.isArray(scrapeData?.posts) ? scrapeData.posts.length : 0,
      followersFromScrape: Number(profileData?.followers) || 0,
      avgLikes: Number(metrics?.avgLikes) || 0,
      avgComments: Number(metrics?.avgComments) || 0,
      engagementRate: Number(metrics?.engagementRate) || 0,
      fetchedAt: new Date().toISOString(),
    },
  };
};

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedProfile, setSelectedProfile] = useState(mockProfiles[0].username);
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(mockProfiles[0]);

  const selectedMockProfile = useMemo(
    () => mockProfiles.find((item) => item.username === selectedProfile) || mockProfiles[0],
    [selectedProfile]
  );

  useEffect(() => {
    if (selectedProfile !== NONE_PROFILE) {
      setProfile(selectedMockProfile);
      setError('');
    }
  }, [selectedMockProfile, selectedProfile]);

  const runApiAnalysis = async (rawValue) => {
    const username = extractUsername(rawValue);
    const url = buildInstagramUrl(rawValue);
    if (!username || !url || username === 'instagram.com') {
      setError('Enter a valid username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const scrapeResponse = await fetch('http://localhost:5000/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, resultsLimit: 30 }),
      });

      if (!scrapeResponse.ok) {
        throw new Error('scrape_failed');
      }

      const scrapeData = await scrapeResponse.json();
      const matchedMock = mockProfiles.find((item) => item.username === username);
      const baseProfile = matchedMock || profile || mockProfiles[0];

      setProfile(mapScrapeToProfile(scrapeData, baseProfile));
      setSelectedProfile(NONE_PROFILE);
    } catch (scrapeError) {
      try {
        const response = await fetch(`http://localhost:5000/api/profiles/${username}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('No account found');
            return;
          }
          throw new Error('profile_fetch_failed');
        }

        const data = await response.json();
        const matchedMock = mockProfiles.find((item) => item.username === username);
        const baseProfile = matchedMock || profile || mockProfiles[0];
        setProfile(mapApiToProfile(data, baseProfile));
        setSelectedProfile(matchedMock ? matchedMock.username : NONE_PROFILE);
      } catch (fetchError) {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (selectedProfile === NONE_PROFILE) {
      await runApiAnalysis(usernameInput);
      return;
    }

    setError('');
    setLoading(true);
    setProfile(selectedMockProfile);
    setLoading(false);
  };

  const showEnterButton = extractUsername(usernameInput).length > 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
          <p className="text-lg font-semibold text-slate-700">Analyzing profile...</p>
        </div>
      </div>
    );
  }

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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600">Mock profiles</label>
                <select
                  value={selectedProfile}
                  onChange={(e) => {
                    setSelectedProfile(e.target.value);
                    setError('');
                  }}
                  className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                >
                  <option value={NONE_PROFILE}>None</option>
                  {mockProfiles.map((item) => (
                    <option key={item.username} value={item.username}>
                      {item.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600">Or enter Instagram URL / username</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && showEnterButton) {
                        runApiAnalysis(usernameInput);
                      }
                    }}
                    placeholder="e.g., @username or instagram.com/username"
                    className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                  />
                  {showEnterButton && (
                    <button
                      onClick={() => runApiAnalysis(usernameInput)}
                      className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                    >
                      Enter
                    </button>
                  )}
                </div>
                {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              </div>

              <button
                onClick={handleAnalyze}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Analyze
              </button>
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
            {activeTab === 'Fetched Details' && <FetchedDetails profile={profile} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;