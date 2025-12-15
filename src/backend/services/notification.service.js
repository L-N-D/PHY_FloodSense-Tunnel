
import { sendAlertEmail } from './email.service.js';
import User from '../modules/user/user.model.js';
import admin from 'firebase-admin';
import { sendPushsafer } from './pushsafer.service.js';
import firebaseApp from '../config/firebase.config.js';

export const sendPushNotification = async (fcmToken, alert, userId) => {
  const message = {
    token: fcmToken,
    notification: {
      title: `ALERT: ${alert.type.toUpperCase()} (${alert.severity})`,
      body: alert.message || 'Basement alert',
    },
    data: {
      type: alert.type,
      severity: alert.severity,
      timestamp: String(alert.timestamp),
    }
  };

  try {
    await admin.messaging(firebaseApp).send(message);
    console.log(`Push sent to user ${userId}`);
  } catch (error) {
    console.error('Error sending push notification:', error);
    // giữ logic xoá token lỗi như bạn đang có
    if (error.code === 'messaging/registration-token-not-registered' ||
        error.code === 'messaging/invalid-registration-token') {
      await User.findByIdAndUpdate(userId, { fcmToken: null });
      console.log(`Removed invalid FCM token for user ${userId}`);
    }
  }
};

export const handleAlert = async (alert) => {
  const users = await User.find({});
  for (const user of users) {
    //if (ALERT_MODE === 'email') {
      if (user.email) await sendAlertEmail(user.email, alert);
    //} else if (ALERT_MODE === 'pushsafer') {
      await sendPushsafer(alert);
    //} else {
    //  console.warn('[Notification] Unknown ALERT_MODE:', ALERT_MODE);
    //}
  }
};
