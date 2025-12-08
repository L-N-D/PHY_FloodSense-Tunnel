'use client';
import { useState } from "react";

export default function RegisterPage() {

    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const updateInfo = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.email || !form.username || !form.password || !form.confirmPassword) {
            return setError("Please fill in all required fields.");
        }

        if (form.password.length < 8) {
            return setError("Password must be at least 8 characters.");
        }

        if (form.password !== form.confirmPassword) {
            return setError("Password and confirmation do not match.");
        }

        setError("");
        console.log("Register data:", form);

        // TODO: Call your register API here
    };

    return (
        <form 
            className="flex flex-col gap-3 w-[80%] mx-auto mt-4 text-white"
            onSubmit={handleSubmit}
        >
            <h2 className="text-3xl font-bold text-center mb-2">Register</h2>

            {error && (
                <p className="text-red-400 text-center text-sm">{error}</p>
            )}

            <label htmlFor="email" className="font-semibold">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={updateInfo}
                className="p-2 rounded-md bg-transparent border border-white/40 text-white focus:ring focus:outline-none"
            />

            <label htmlFor="username" className="font-semibold">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={updateInfo}
                className="p-2 rounded-md bg-transparent border border-white/40 text-white focus:ring focus:outline-none"
            />

            {/* Password */}
            <label htmlFor="password" className="font-semibold">Password:</label>
            <div className="relative">
                <input
                    type={showPass ? "text" : "password"}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={updateInfo}
                    className="p-2 w-full rounded-md bg-transparent border border-white/40 text-white focus:ring focus:outline-none pr-10"
                />
                <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white"
                    onClick={() => setShowPass(!showPass)}
                >
                    {showPass ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                </span>
            </div>

            {/* Confirm Password */}
            <label htmlFor="confirmPassword" className="font-semibold">Confirm Password:</label>
            <div className="relative">
                <input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={updateInfo}
                    className="p-2 w-full rounded-md bg-transparent border border-white/40 text-white focus:ring focus:outline-none pr-10"
                />
                <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-white"
                    onClick={() => setShowConfirm(!showConfirm)}
                >
                    {showConfirm ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                </span>
            </div>

            <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition p-2 rounded-md font-semibold mt-4"
            >
                Register
            </button>

            <p className="text-center text-sm mt-2">
                Already have an account?
                <a href="/auth/login" className="text-blue-400 hover:underline ml-1">
                    Login
                </a>
            </p>
        </form>
    );
}
