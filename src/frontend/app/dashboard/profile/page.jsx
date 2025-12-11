"use client";

import { useState } from "react";
import { useAuthContext } from "@/lib/context/authContext";

const widgetStyle =
  "relative w-[900px] min-h-[500px] border border-white/40 rounded-xl flex flex-col items-start px-16 py-10 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] \
  before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-60 before:pointer-events-none \
  after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/10 after:via-transparent after:to-transparent after:opacity-40 after:pointer-events-none";

export default function ProfilePage() {

  // STATES
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {user} = useAuthContext();
  // console.log(user);

  // HANDLE CHANGE PASSWORD
  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    // VALIDATION
    if (!newPass || !confirm) {
      return setError("Password fields cannot be empty.");
    }
    if (newPass.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (newPass !== confirm) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      // CALL BACKEND API
      const res = await fetch("http://YOUR_BACKEND_API/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // nếu bạn dùng cookie
        body: JSON.stringify({
          newPassword: newPass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password has been changed successfully!");
      setNewPass("");
      setConfirm("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-[#060C11] justify-center items-center text-white">

      <div className={widgetStyle}>

        <h2 className="text-2xl font-semibold mb-10 w-full text-center">Hello, {user ? user.username : ''}</h2>

        <div className="flex flex-col gap-6 w-full">

          <div className="flex justify-between w-full text-lg">
            <span className="text-gray-300">Username:</span>
            <span className="text-white">{user ? user.username : ''}</span>
          </div>

          <div className="flex justify-between w-full text-lg">
            <span className="text-gray-300">Email:</span>
            <span className="text-white">{user ? user.email : ''}</span>
          </div>

          <div className="flex justify-between w-full text-lg">
            <span className="text-gray-300">New password:</span>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="bg-transparent border border-gray-400 px-3 py-1 w-60 rounded text-white outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex justify-between w-full text-lg">
            <span className="text-gray-300">Confirm password:</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="bg-transparent border border-gray-400 px-3 py-1 w-60 rounded text-white outline-none"
            />
          </div>

          {/* Activated */}
          <div className="flex justify-between w-full text-lg mt-4">
            <span className="text-yellow-500 font-semibold">Activated:</span>
            <span className="text-orange-400 font-semibold">15:00 | 01/11/2025</span>
          </div>

          {/* ERROR MESSAGE */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* SUCCESS MESSAGE */}
          {success && <p className="text-green-400 text-center">{success}</p>}

          {/* BUTTON */}
          <div className="w-full flex justify-center mt-4">
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-black font-semibold 
                ${loading ? "bg-gray-300" : "bg-green-400 hover:bg-green-300"} 
                transition-all`}
            >
              {loading ? "Processing..." : "Change Password"}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
