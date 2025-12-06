// config/firebase.config.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let app;

// Tránh initialize nhiều lần nếu file được import lại
if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
} else {
  app = admin.app();
}

export default app;
