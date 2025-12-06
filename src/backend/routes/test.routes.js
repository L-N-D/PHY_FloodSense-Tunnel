// // routes/test.routes.js
// import express from 'express';
// import { handleAlert } from '../services/notification.service.js';

// const router = express.Router();

// /**
//  * Test API để bắn alert thẳng từ backend
//  * POST /api/test/alert
//  * body: { type?: 'fire' | 'flood', message?: string }
//  */
// router.post('/alert', async (req, res) => {
//   try {
//     const { type = 'fire', message } = req.body;

//     const alert = {
//       type,                        // 'fire' | 'flood'
//       severity: 'HIGH',
//       timestamp: Date.now(),
//       message:
//         message ||
//         (type === 'fire'
//           ? 'TEST: Cảnh báo cháy từ /api/test/alert.'
//           : 'TEST: Cảnh báo ngập từ /api/test/alert.'),
//     };

//     await handleAlert(alert);

//     return res.status(200).json({
//       message: 'Test alert sent',
//       alert,
//     });
//   } catch (err) {
//     console.error('Error in /api/test/alert:', err);
//     return res.status(500).json({ error: err.message });
//   }
// });

// export default router;
