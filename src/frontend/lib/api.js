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

  // --- 1. Gọi request lần đầu
  let res = await request();

  // --- 2. Nếu token hết hạn → status 401
  if (res.status === 401) {
    // Gọi refresh token
    const refresh = await fetch(baseURL + "/api/refresh", {
      method: "GET",
      credentials: "include",
    });

    // Nếu refresh thất bại → logout
    if (!refresh.ok) {
      return {
        ok: false,
        status: 401,
        data: { error: "Unauthorized" },
      };
    }

    // --- 3. Refresh thành công → gọi lại request ban đầu
    res = await request();
  }

  // --- 4. Parse JSON
  let data = null;
  try {
    data = await res.json();
  } catch {}

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}
