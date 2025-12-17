import AlarmLog from './alarm.model.js';

export async function countAlarmsTodayService() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const now = new Date();

  const [total, fire, flood] = await Promise.all([
    AlarmLog.countDocuments({
      createdAt: { $gte: startOfToday, $lte: now }
    }),
    AlarmLog.countDocuments({
      type: 'fire',
      createdAt: { $gte: startOfToday, $lte: now }
    }),
    AlarmLog.countDocuments({
      type: 'flood',
      createdAt: { $gte: startOfToday, $lte: now }
    }),
  ]);

  return {
    from: startOfToday,
    to: now,
    total,
    fire,
    flood,
  };
}

export const getNotificationService = async () => {

  const latestLogs = await AlarmLog
    .find()
    .sort({ createdAt: -1 })
    .select('type message createdAt -_id')
    .limit(10)
    .lean();

    return latestLogs;
}