// modules/user/user.model.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: String,
  type: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },

  // Lưu FCM token của thiết bị
  fcmToken: { type: String, default: null },

  tokens: {
    type: [tokenSchema],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);
export default User;
