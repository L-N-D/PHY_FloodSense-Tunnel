'use client';

import { useAuthContext } from "@/lib/context/authContext.js";
import { useAuth } from "@/hook/useAuth.js";
import { useRouter } from "next/navigation.js";

const NavBar = () => {

    const router = useRouter();

    const { user, loading } = useAuthContext();
    const { logout } = useAuth();

    const handelLogout = async () => {
        await logout();
        router.push('/home');
    };

    return (
        <div className="fixed h-[60px] min-w-screen flex border-b border-white bg-[#060C11] items-center gap-2">
            <i className="fa-solid fa-bars ml-4"></i>
            <a href={user ? '/dashboard' : "/home"} className="h-[120px] flex items-center">
                <img
                    src="/system/Smart_Tunnel.png"
                    alt="Logo"
                    className="h-full object-contain select-none"
                />
            </a>

            <div className="fixed right-[60px] h-[40px] w-[200px] flex justify-around items-center">
                {loading ? (<div className="flex items-center gap-2">
                    <div className="h-[40px] w-[90px] h-6 bg-white/20 rounded-md animate-pulse"></div>
                    <div className="h-[40px] w-[90px] h-10 bg-[#007bff]/50 rounded-md animate-pulse"></div>
                </div>) : user ? (

                    <div className="flex justify-center items-center gap-4">
                        <span className="text-white font-semibold text-lg uppercase tracking-wide 
                       max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                            Hello {user.username} |
                        </span>
                        <div className="flex gap-2" onClick={handelLogout}>
                            <button type="button" className="h-[40px] w-[90px] border border-white rounded-[8px] bg-[#007bff] text-[16px] font-[500] flex justify-center items-center whitespace-nowrap hover:bg-[#e6f0ff] hover:text-[#333446]">
                                Logout
                            </button>
                        </div>
                    </div>


                ) : (
                    <div className="flex gap-2">
                        <a
                            href="/auth/login"
                            className="h-[40px] w-[90px] border border-white rounded-[8px] bg-[#007bff] text-[16px] font-[500] flex justify-center items-center whitespace-nowrap hover:bg-[#e6f0ff] hover:text-[#333446]">
                            Login
                        </a>
                        <a
                            href="/auth/register"
                            className="h-[40px] w-[90px] border border-white rounded-[8px] bg-white text-[#007bff] text-[16px] font-[500] flex justify-center items-center whitespace-nowrap hover:bg-[#e6f0ff] hover:text-[#333446]">
                            Register
                        </a>
                    </div>)}
            </div>
        </div>
    );
};

export default NavBar;
