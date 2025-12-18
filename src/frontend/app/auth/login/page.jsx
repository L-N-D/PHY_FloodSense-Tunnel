'use client';
import { useState } from "react";
import { useAuth } from "../../../hook/useAuth.js";
import { useRouter } from "next/navigation.js";
import Spinner from "@/components/ui/Loading.jsx";

export default function LoginPage() {

    const router = useRouter();
    const { login, error, loading } = useAuth();

    const [form, setForm] = useState({ username: '', password: '' });
    const [err, setErr] = useState('');
    const [showPass, setShowPass] = useState(false);

    const updateInfo = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            return setErr('Vui lòng nhập đầy đủ Username và Password!');
        }

        setErr('');
        // console.log("Login data:", form);

        const res = await login(form.username, form.password);

        if (res && !res.error){
            router.push('/dashboard');
        }else{
            setErr(err || 'Login fail');
        }

    };

    if (loading){return <div className="w-full h-full"> <Spinner /> </div>}

    return (
        <form 
            className="flex flex-col gap-3 w-[80%] mx-auto mt-4 text-white"
            onSubmit={handleSubmit}
        >
            <h2 className="text-3xl font-bold text-center mb-2">Log in</h2>

            {err && (
                <p className="text-red-400 text-center text-sm">{err}</p>
            )}

            <label htmlFor="username" className="font-semibold">
                Username:
            </label>
            <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={updateInfo}
                className="p-2 rounded-md bg-transparent border border-white/40 text-white focus:ring focus:outline-none"
            />

            <label htmlFor="password" className="font-semibold">
                Password:
            </label>
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

            <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 transition p-2 rounded-md font-semibold mt-4"
            >
                Login
            </button>

            <p className="text-center text-sm mt-2">
                You don't have accoount? 
                <a href="/auth/register" className="text-blue-400 hover:underline ml-1">
                    Register
                </a>
            </p>
        </form>
    );
}
