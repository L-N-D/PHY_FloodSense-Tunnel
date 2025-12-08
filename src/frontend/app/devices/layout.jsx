import NavBar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";

export default function deviceLayout({ children }) {

    return (

        <div className="flex-1 bg-[#060C11]">

            <div className="fixed top-0 left-0 right-0 z-50">
                <NavBar />
            </div>


            <div className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-64 z-40">
                <SideBar />
            </div>

            {children}
        </div>

    );

}