import React from 'react';

const cardClasses = 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm';

const AIInsights = ({ profile }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className={cardClasses}>
          <div className="mb-4 text-base font-semibold text-slate-900">Competitor Insights</div>
          <p className="text-slate-700">{profile.competitorInsights}</p>
        </section>
        <section className={cardClasses}>
          <div className="mb-4 text-base font-semibold text-slate-900">Content Strategy</div>
          <p className="text-slate-700">{profile.contentStrategy}</p>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={cardClasses}>
          <div className="mb-4 text-base font-semibold text-slate-900">Hashtag Recommendations</div>
          <div className="flex flex-wrap gap-2">
            {profile.hashtagRecommendations.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </section>
        <section className={cardClasses}>
          <div className="mb-4 text-base font-semibold text-slate-900">Audience Behavior</div>
          <p className="text-slate-700">{profile.audienceBehavior}</p>
        </section>
      </div>

      <section className={cardClasses}>
        <div className="mb-4 text-base font-semibold text-slate-900">Why This Works</div>
        <ul className="space-y-3 text-slate-700">
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
            <span>Clear value proposition tuned to the target audience.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
            <span>High-quality visual content that stands out in feeds.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
            <span>Consistent storytelling creates trust and repeat engagement.</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AIInsights;
