// services/notification.service.js
import admin from 'firebase-admin';
import firebaseApp from '../config/firebase.config.js';
import { sendAlertEmail } from './email.service.js';
import User from '../modules/user/user.model.js';

/**
 * Gửi push notification qua FCM tới 1 thiết bị
 */
export const sendPushNotification = async (fcmToken, alert) => {
  const title =
    alert.type === 'fire'
      ? 'Cảnh báo cháy trong hầm xe'
      : 'Cảnh báo ngập nước trong hầm xe';

  const body = alert.message;

  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
    data: {
      type: alert.type,
      severity: alert.severity,
      timestamp: String(alert.timestamp),
    },
  };

  await admin.messaging(firebaseApp).send(message);
};

/**
 * Nhận alert từ MQTT, gửi cho tất cả user:
 *  - Push notification nếu có fcmToken
 *  - Email nếu có email
 */
export const handleAlert = async (alert) => {
  const users = await User.find({});

  for (const user of users) {
    // 1. Push notification
    if (user.fcmToken) {
      try {
        await sendPushNotification(user.fcmToken, alert);
      } catch (err) {
        console.error('Error sending push notification:', err);
      }
    }

    // 2. Email
    if (user.email) {
      try {
        await sendAlertEmail(user.email, alert);
      } catch (err) {
        console.error('Error sending alert email:', err);
      }
    }
  }
};
