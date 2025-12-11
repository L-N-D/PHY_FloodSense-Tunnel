'use client';
import { useState } from "react";
import { useAuth } from "@/hook/useAuth";

export default function RegisterPage() {
    const { register, loading, error } = useAuth();
    const [success, setSuccess] = useState(false);
    const [localError, setLocalError] = useState('');

    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const updateInfo = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.username || !form.password || !form.confirmPassword) {
            setLocalError("Please fill in all required fields.");
            return;
        }
        if (form.password.length < 8) {
            setLocalError("Password must be at least 8 characters.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setLocalError("Password and confirmation do not match.");
            return;
        }

        setLocalError('');
        setSuccess(false);

        const res = await register(form.email, form.username, form.password);

        if (res) {
            setSuccess(true);
            setForm({ email: '', username: '', password: '', confirmPassword: '' });
        }
    };

    return (
        <form
            className="flex flex-col gap-3 w-[80%] mx-auto mt-4 text-white"
            onSubmit={handleSubmit}
        >
            <h2 className="text-3xl font-bold text-center mb-2">Register</h2>

            {localError && <p className="text-red-400 text-center text-sm">{localError}</p>}

            {error && <p className="text-red-400 text-center text-sm">{error}</p>}

            {success && (
                <p className="text-green-400 text-center text-sm">
                    Registration successful! You can now <a href="/auth/login" className="underline">login</a>.
                </p>
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

            {/* Submit button */}
            <button
                type="submit"
                disabled={loading}
                className={`bg-green-600 hover:bg-green-700 transition p-2 rounded-md font-semibold mt-4 flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        Registering...
                    </>
                ) : (
                    'Register'
                )}
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
