// modules/auth/auth.controller.js
import { loginService, logoutService, registerService } from './auth.service.js';
import User from '../user/user.model.js';

export const loginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json('Username or Password missed');
  }

  try {
    const result = await loginService(username, password);

    if (!result) {
      return res.status(400).json({ message: 'Login failed' });
    }

    const { accessToken, refreshToken, user } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.setHeader('authorization', `Bearer ${accessToken}`);

    // Trả thêm user + accessToken cho FE
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        username: user.username,
        email: user.email,
        fcmToken: user.fcmToken,
      },
    });
  } catch (err) {
    console.log(`[Controller] | auth ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(401).json('Username or Password missed');
    }

    const result = await registerService(username, email, password);

    if (!result) {
      return res.status(400).json({ message: 'Register fail' });
    }

    if (result.success === false) {
      return res.status(400).json({ message: result.message || 'User already exist' });
    }

    res.status(200).json({ message: 'Register successful' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    const username = req.username;

    await logoutService(username);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// Lưu FCM device token do FE gửi lên
export const saveDeviceTokenController = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const username = req.username;

    if (!fcmToken) {
      return res.status(400).json({ message: 'Missing fcmToken' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fcmToken = fcmToken;
    await user.save();

    return res.status(200).json({ message: 'Device token saved' });
  } catch (err) {
    console.error('[Controller] saveDeviceToken', err);
    return res.status(500).json({ error: err.message });
  }
};
