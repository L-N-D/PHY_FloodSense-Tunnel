'use client';
import { createContext, useContext, useState } from "react";

const authContext = createContext(null);

export function AuthContextProvider ({children}) {

    const [user, setUser] = useState(null);

    const saveUser = (info) => {
        setUser(info);
    }
    const clearUser = () => {
        setUser(null);
    }

    return (
        <authContext.Provider value={{user, saveUser, clearUser}}>
            {children}
        </authContext.Provider>
    );

}

export function useAuthContext () {
    return useContext(authContext);
}