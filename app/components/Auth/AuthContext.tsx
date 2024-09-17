'use client'

import { auth } from "@/firebase"
import { firestore } from "@/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react"
import Loading from "../Element/Loading"

interface AuthContextType{
    currentUser: User| null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children:ReactNode}) => {
    const [currentUser, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        } );
        return () => unsubscribe();
    }, []);
    if (loading) {
        // ロード中はスピナーやローディングメッセージを表示
        return <Loading/>;
    }


    return(
        <AuthContext.Provider value={{currentUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth =  ():AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined){
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}