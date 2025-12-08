
const liquidGlassClasses = "relative w-[500px] h-[600px] mt-4 flex flex-col justify-center items-center bg-white/5 backdrop-blur-md border border-white/40 rounded-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/70 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none hover:bg-white/30 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/40 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";

export default function authLayout ({children}) {

    return (
        <div className="flex-1 bg-[#060C11] flex flex-col justify-center items-center">
        
            
            <div className={liquidGlassClasses}>
                <a href="/dashboard"><img src='.\system\Smart_Tunnel.png'></img></a>
                {children}</div>
        
        </div>
    );

}