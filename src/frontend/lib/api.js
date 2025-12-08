const baseURL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let queue = [];

function waitForRefresh() {
  return new Promise((resolve) => queue.push(resolve));
}

async function refreshToken() {
  const res = await fetch(baseURL + "api/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Refresh token failed");
  }

  const json = await res.json();

  // your API returns: dataRefresh.accessToken ?
  const newAccessToken = json.accessToken;

  return newAccessToken;
}

export default async function api(url, options = {}) {

  let accessToken = options.accessToken || ""; // from localStorage or auth state

  async function doRequest(token) {
    const res = await fetch(baseURL + url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: options.body || null,
    });

    const json = await res.json();
    return { status: res.status, data: json };
  }

  // First request attempt
  let result = await doRequest(accessToken);

  // If access token expired
  if (result.data?.message === "Token invalid or expired") {

    // If already refreshing → wait
    if (isRefreshing) {
      const newToken = await waitForRefresh();
      return (await doRequest(newToken)).data;
    }

    // Start refreshing here
    isRefreshing = true;

    try {
      const newToken = await refreshToken();

      // Resolve all queued requests
      queue.forEach((resolve) => resolve(newToken));
      queue = [];
      isRefreshing = false;

      // Retry original request with new token
      return (await doRequest(newToken)).data;

    } catch (err) {
      isRefreshing = false;
      queue = [];
      throw err;
    }
  }

  return result.data;
}
