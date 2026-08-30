const getCookieMap = () => {
  if (typeof document === "undefined") return {};

  return document.cookie.split("; ").reduce((cookies, cookie) => {
    const [name, ...valueParts] = cookie.split("=");
    if (!name) return cookies;

    cookies[name] = decodeURIComponent(valueParts.join("=") || "");
    return cookies;
  }, {});
};

const parseGAClientId = (value) => {
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length >= 4 && parts[0] === "GA") {
    return parts.slice(-2).join(".");
  }

  return value;
};

const parseGA4SessionCookie = (value) => {
  if (!value) return {};

  const sessionId = value.match(/(?:^|[.$])s(\d+)/)?.[1];
  const sessionNumber = value.match(/(?:^|[.$])o(\d+)/)?.[1];

  if (sessionId || sessionNumber) {
    return {
      ga_session_id: sessionId || null,
      ga_session_number: sessionNumber || null,
    };
  }

  const parts = value.split(".");
  return {
    ga_session_id: /^\d+$/.test(parts[2] || "") ? parts[2] : null,
    ga_session_number: /^\d+$/.test(parts[3] || "") ? parts[3] : null,
  };
};

export const getGoogleAnalyticsTrackingData = () => {
  const cookies = getCookieMap();
  const sessionCookieEntry = Object.entries(cookies).find(
    ([name]) => name.startsWith("_ga_")
  );
  const sessionData = parseGA4SessionCookie(sessionCookieEntry?.[1]);

  return {
    ga_client_id: parseGAClientId(cookies._ga),
    ga_session_id: sessionData.ga_session_id || null,
    ga_session_number: sessionData.ga_session_number || null,
    ga_session_cookie_name: sessionCookieEntry?.[0] || null,
  };
};
