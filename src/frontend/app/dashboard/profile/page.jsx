"use client";

import { useState } from "react";
import { useAuthContext } from "@/lib/context/authContext";
import { useUser } from "@/hook/useUser";

const widgetStyle =
  "relative w-[900px] min-h-[500px] border border-white/40 rounded-xl flex flex-col items-start px-16 py-10 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] \
  before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-60 before:pointer-events-none \
  after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/10 after:via-transparent after:to-transparent after:opacity-40 after:pointer-events-none";

export default function ProfilePage() {

  const { loading, error, success, changePassword } = useUser();

  // STATES
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { user } = useAuthContext();

  // HANDLE CHANGE PASSWORD
  const handleChangePassword = async () => {
    setError("");

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
      // CALL BACKEND API

      await changePassword(newPass);

    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

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
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="bg-transparent border border-gray-400 px-3 py-1 w-60 rounded text-white outline-none"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
              </span>
            </div>

          </div>

          {/* Confirm Password */}
          <div className="flex justify-between w-full text-lg">
            <span className="text-gray-300">Confirm password:</span>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-transparent border border-gray-400 px-3 py-1 w-60 rounded text-white outline-none"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
              </span>
            </div>
          </div>

          {/* Activated */}
          <div className="flex justify-between w-full text-lg mt-4">
            <span className="text-yellow-500 font-semibold">Activated:</span>
            <span className="text-orange-400 font-semibold">{user?.createdAt
              ? new Date(user.createdAt).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
              : ''}</span>
          </div>

          {/* ERROR MESSAGE */}
          {err && <p className="text-red-500 text-center">{err}</p>}

          {/* SUCCESS MESSAGE */}
          {success && <p className="text-green-400 text-center">{'Password change successful'}</p>}
          {!success && <p className="text-red-400 text-center">{error}</p>}

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
