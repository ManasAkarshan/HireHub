"use client"
import { getCurrentUser } from "@/app/db/apiAuth";
import useFetch from "@/hooks/useFetch";
import { createContext, useContext, useEffect } from "react";

const UserContext = createContext();

const UserContextProvider = ({children})=>{
    const {data:user, loading, fn: fetchUser} = useFetch(getCurrentUser)
    // whenever user login the data : user changes so user context will re-render

    const isAuthenticated = user?.role === "authenticated";

    useEffect(()=>{
        fetchUser()
    }, [])

    return (
        <UserContext.Provider value={{user, loading, isAuthenticated, fetchUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserState = () => {
    return useContext(UserContext);
};

export default UserContextProvider
  