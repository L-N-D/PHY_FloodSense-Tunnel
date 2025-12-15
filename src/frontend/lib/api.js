const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default async function api(url, options = {}) {
  async function request() {
    const res = await fetch(baseURL + url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      body: options.body || null,
    });

    return res;
  }

  let res = await request();

  if (res.status === 401) {
    const refresh = await fetch(baseURL + "/api/refresh", {
      method: "GET",
      credentials: "include",
    });

    if (!refresh.ok) {
      return {
        ok: false,
        payload: await refresh.json()
      };
    }

    res = await request();
  }

  let data = null;
  try {
    data = await res.json();
  } catch {}

  return {
    ok: res.ok,
    payload: data,
  };
}
