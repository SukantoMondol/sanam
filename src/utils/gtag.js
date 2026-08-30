// lib/gtag.js

// Log the pageview with the URL
export const pageview = (url) => {
  if (typeof window.gtag === "function") {
    window.gtag("config", "G-WPE03WB76T", {
      page_path: url,
    });
  } else {
    console.warn("gtag function not found. GA4 pageview not sent.");
  }
};

// Log specific events happening on the page
export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.warn(`gtag function not found. GA4 event "${action}" not sent.`);
  }
};
