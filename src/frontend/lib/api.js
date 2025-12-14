const baseURL = process.env.NEXT_PUBLIC_API_URL;

let queue = []
let isRefreshing = false;

function waitforRefresh () {
    return new Promise((resolve) => queue.push(resolve));
}

async function refreshToken () {
    const res = await fetch(baseURL + 'api/refresh', {
        method: 'POST',
        credentials: 'include'
    });

    if (!res.ok){
        throw new Error('Refresh Token failed');
    }

    const data = await res.json();

    return res.headers.authorization.replace('Bearer ', '');

}

export default async function call(url, options = {}) {


    const res = await fetch(apiURL + url, {
        method: options.method || 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${options.accesToken}` || ''
        },
        credentials: options.credentials,
        body: options.body || null
    })

    const data = await res.json();

    if (data.message === 'Token invalid or expired') {
        const refresh = await fetch(apiURL + 'api/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        if (refresh.status == 200) {
            const dataRefresh = await refresh.json();

            const newAccessToken = dataRefresh.accesToken;

            res = await fetch(apiURL + url, {
                method: options.method || "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${newAccessToken}`
                },
                credentials: "include",
                body: options.body || null
            });

            data = await res.json();

        }

    }

    return data;

}