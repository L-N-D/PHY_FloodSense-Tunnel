// services/email.service.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // 587 => TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * alert: {
 *   type: 'fire' | 'flood',
 *   severity: 'HIGH' | 'MEDIUM' | ...,
 *   timestamp: number (ms),
 *   message: string
 * }
 */
export const sendAlertEmail = async (to, alert) => {
  const subject =
    alert.type === 'fire'
      ? '[ALERT] Nguy cơ cháy trong hầm xe'
      : '[ALERT] Nguy cơ ngập nước trong hầm xe';

  const text = `
Xin chào,

Hệ thống Basement Monitor vừa phát hiện một sự cố:

- Loại cảnh báo: ${alert.type.toUpperCase()}
- Mức độ: ${alert.severity}
- Thời gian: ${new Date(alert.timestamp).toLocaleString('vi-VN')}
- Mô tả: ${alert.message}

Vui lòng kiểm tra khu vực hầm xe và hệ thống PCCC/thoát nước ngay lập tức.

Trân trọng,
Hệ thống giám sát hầm xe
`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });
};
