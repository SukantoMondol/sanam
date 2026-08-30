const isLocalBaseUrl = (url) =>
  !!url && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/.test(url);

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://sanamstore.net/",
  generateRobotsTxt: true, // Generate robots.txt file
  sitemapSize: 7000, // Limit the number of URLs per sitemap file
  changefreq: "daily", // Change frequency
  priority: 0.7, // Priority of URLs
  generateIndexSitemap: true,
  additionalPaths: async (config) => {
    if (isLocalBaseUrl(process.env.BASE_URL)) {
      // Skip fetching remote sitemap paths during local development.
      return [];
    }

    const Urls = await fetchUrls();
    return Urls.map((url) => ({
      loc: url?.url,
      changefreq: "daily",
      priority: 0.7,
    }));
  },
};

async function fetchUrls() {
  const response = await fetch(`${process.env.BASE_URL}/site-map`);
  const data = await response.json();
  return data?.data || [];
}
