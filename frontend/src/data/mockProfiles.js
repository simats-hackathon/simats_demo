const mockProfiles = [
  {
    username: 'beauty_brand_ella',
    displayName: 'Ella Beauty',
    followers: 82000,
    avg_likes: 4200,
    avg_comments: 320,
    bio: 'Premium skincare routines, cruelty-free beauty, and self-care tips for modern women.',
    businessCategory: 'B2C – Beauty Brand',
    businessType: 'B2C',
    audienceType: 'Professionals',
    interestLevel: 'High',
    tags: ['#skincare', '#beauty', '#wellness', '#selfcare'],
    recommendedAction: 'Launch a branded skincare campaign focused on evenings and product tutorials.',
    businessDescription:
      'Ella Beauty is a premium skincare brand that engages an upscale, wellness-minded audience with polished tutorials and product education.',
    keyInsights: [
      'High engagement from tutorial reels and product tips.',
      'Audience responds well to polished before-and-after content.',
      'Strong brand voice in wellness and self-care.',
    ],
    strengths: ['Polished visual identity', 'Consistent skincare education', 'Strong comment engagement'],
    weaknesses: ['Low user-generated content', 'Limited posting frequency'],
    competitorInsights:
      'Competitors using live skincare demos and exclusive offers outperform in engagement by emphasizing authenticity and urgency.',
    contentStrategy:
      'Focus on 3 tutorial reels per week, quick routine stories, and monthly product launch teasers.',
    hashtagRecommendations: ['#GlowUp', '#CleanBeauty', '#SkinConfidence', '#BeautyRoutine'],
    audienceBehavior:
      'Audience is active after work hours and prefers short, actionable reels that show real benefits.',
    chartData: {
      engagementVsPosts: [
        { label: 'Week 1', value: 68 },
        { label: 'Week 2', value: 74 },
        { label: 'Week 3', value: 81 },
        { label: 'Week 4', value: 77 },
      ],
      likesDistribution: [
        { label: 'Text', value: 62 },
        { label: 'Image', value: 78 },
        { label: 'Reel', value: 91 },
        { label: 'Story', value: 55 },
      ],
      postingTimes: [
        { label: 'Morning', value: 52 },
        { label: 'Afternoon', value: 68 },
        { label: 'Evening', value: 89 },
        { label: 'Late Night', value: 61 },
      ],
      contentTypeComparison: [
        { label: 'Tutorials', value: 88 },
        { label: 'Behind the scenes', value: 72 },
        { label: 'Product launches', value: 80 },
        { label: 'UGC', value: 58 },
      ],
    },
  },
  {
    username: 'fitness_trend_sam',
    displayName: 'Fitness Trend Sam',
    followers: 54000,
    avg_likes: 2900,
    avg_comments: 210,
    bio: 'At-home workout plans, nutrition hacks, and motivation for busy professionals.',
    businessCategory: 'B2C – Fitness Coach',
    businessType: 'B2C',
    audienceType: 'Professionals',
    interestLevel: 'Medium',
    tags: ['#fitness', '#workout', '#nutrition', '#wellness'],
    recommendedAction: 'Build a 4-week transformation series and offer an onboarding challenge.',
    businessDescription:
      'Fitness Trend Sam is a fitness coach brand that inspires busy professionals with efficient workouts and nutrition guidance.',
    keyInsights: [
      'Strong follow-through on motivational posts.',
      'Reels with quick workouts perform best.',
      'Nutrition tips generate meaningful saves.',
    ],
    strengths: ['Clear fitness positioning', 'Actionable daily tips', 'Good save rate'],
    weaknesses: ['Uneven posting cadence', 'Limited audience segmentation'],
    competitorInsights:
      'Top competitor content focuses on community challenges and daily accountability, resulting in higher story interactions.',
    contentStrategy:
      'Publish 2 training reels, 1 nutrition tip, and 1 client testimonial each week.',
    hashtagRecommendations: ['#FitLife', '#BusyProfessionals', '#WorkoutAtHome', '#NutritionHacks'],
    audienceBehavior:
      'Audience engages most before and after the workday and values short, results-driven content.',
    chartData: {
      engagementVsPosts: [
        { label: 'Week 1', value: 55 },
        { label: 'Week 2', value: 62 },
        { label: 'Week 3', value: 65 },
        { label: 'Week 4', value: 70 },
      ],
      likesDistribution: [
        { label: 'Text', value: 50 },
        { label: 'Image', value: 69 },
        { label: 'Reel', value: 83 },
        { label: 'Story', value: 47 },
      ],
      postingTimes: [
        { label: 'Morning', value: 78 },
        { label: 'Afternoon', value: 60 },
        { label: 'Evening', value: 71 },
        { label: 'Late Night', value: 40 },
      ],
      contentTypeComparison: [
        { label: 'Workouts', value: 82 },
        { label: 'Meals', value: 70 },
        { label: 'Motivation', value: 75 },
        { label: 'Q&A', value: 62 },
      ],
    },
  },
  {
    username: 'travel_story_nina',
    displayName: 'Travel Story Nina',
    followers: 64000,
    avg_likes: 3100,
    avg_comments: 260,
    bio: 'Adventure travel guides, destination storytelling, and creative travel planning.',
    businessCategory: 'B2C – Travel Creator',
    businessType: 'B2C',
    audienceType: 'Students',
    interestLevel: 'Medium',
    tags: ['#travel', '#adventure', '#storytelling', '#explore'],
    recommendedAction: 'Position around weekend escapes and collaboration posts with gear brands.',
    businessDescription:
      'Travel Story Nina uses narrative travel content and destination advice to connect with young adventure seekers.',
    keyInsights: [
      'Location-based posts drive the most saves.',
      'Behind-the-scenes content boosts audience trust.',
      'Story polls increase remarketing opportunities.',
    ],
    strengths: ['Strong storytelling', 'High save potential', 'Visual destination content'],
    weaknesses: ['Lower comment depth', 'Inconsistent posting theme'],
    competitorInsights:
      'Competitors that blend travel planning with packing tips see better sustained engagement.',
    contentStrategy:
      'Use destination reels, packing guides, and weekend inspiration twice a week.',
    hashtagRecommendations: ['#WeekendEscape', '#TravelPlanning', '#StoryDrivenTravel', '#TravelInspo'],
    audienceBehavior:
      'Students and young travelers engage in the late afternoon and weekend planning sessions.',
    chartData: {
      engagementVsPosts: [
        { label: 'Week 1', value: 60 },
        { label: 'Week 2', value: 65 },
        { label: 'Week 3', value: 67 },
        { label: 'Week 4', value: 72 },
      ],
      likesDistribution: [
        { label: 'Text', value: 53 },
        { label: 'Image', value: 75 },
        { label: 'Reel', value: 84 },
        { label: 'Story', value: 66 },
      ],
      postingTimes: [
        { label: 'Morning', value: 57 },
        { label: 'Afternoon', value: 80 },
        { label: 'Evening', value: 66 },
        { label: 'Late Night', value: 53 },
      ],
      contentTypeComparison: [
        { label: 'Guides', value: 79 },
        { label: 'Reels', value: 81 },
        { label: 'Tips', value: 73 },
        { label: 'Stories', value: 64 },
      ],
    },
  },
];

export default mockProfiles;
