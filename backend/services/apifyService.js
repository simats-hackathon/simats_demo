const fetch = require("node-fetch");

const API_TOKEN = process.env.APIFY_TOKEN;

const runApify = async (url) => {
  const response = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${API_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        directUrls: [url],
        resultsType: "details"
      }),
    }
  );

  const data = await response.json();
  return data;
};

module.exports = { runApify };