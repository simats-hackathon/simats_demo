const express = require('express');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./routes/profileRoutes');
const { runApify } = require('./services/apifyService');
const { analyzeData } = require('./services/analysisService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// existing routes (keep this as it is)
app.use('/api/profiles', profileRoutes);

// 🔥 MAIN SCRAPE + ANALYZE ROUTE
app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;

  try {
    // Step 1: Get posts data from Apify
    const posts = await runApify(url);

    if (!posts || posts.length === 0) {
      return res.status(400).json({ error: "No data found" });
    }

    // Step 2: Get followers (fallback if not present)
    const followers =
      posts[0]?.owner?.followersCount || 1000;

    // Step 3: Analyze data
    const analysis = analyzeData(posts, followers);

    // Step 4: Send final response
    res.json({
      success: true,
      totalPosts: posts.length,
      posts,
      analysis
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});