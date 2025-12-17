import { countAlarmsTodayService } from './alarm.service.js';

export const countAlarmsTodayController = async (req, res) => {
  try {
    const data = await countAlarmsTodayService();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to count alarms',
    });
  }
};