import axios from 'axios';
import qs from 'qs';

const PUSHSAFER_API = 'https://www.pushsafer.com/api';

const formatVNTime = (ts) =>
  new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(ts));

export const sendPushsafer = async (alert) => {
  const key = process.env.PUSHSAFER_KEY;

  if (!key) {
    console.error('[Pushsafer] Missing PUSHSAFER_KEY');
    return;
  }

  const payload = qs.stringify({
    k: key,
    t: `🚨 ${alert.type.toUpperCase()} ALERT`,
    m: `
${alert.message}
Severity: ${alert.severity}
Time: ${formatVNTime(alert.timestamp)}
`.trim(),
    s: 11,
    v: 1,
    i: 2,
    c: '#FF0000',
    pr: 2,
  });

  try {
    const res = await axios.post(PUSHSAFER_API, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    // console.log('Pushsafer sent:', res.data);
  } catch (err) {
    console.error('[Pushsafer] Error:', err.response?.data || err.message);
  }
};
