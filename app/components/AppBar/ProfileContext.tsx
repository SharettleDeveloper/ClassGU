'use client'
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { firestore, auth } from "@/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";

const ProfileContext = createContext<any>(null);

export const useProfile = () => {
    return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchprofile = async () => {
            const user = auth.currentUser;
            if (user) {
                const userEmail = user.email;
                const docRef = doc(firestore, `users/users/${userEmail}/detail`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                } else {
                    setProfile(null);
                }
            }
            setLoading(false);
        };

        fetchprofile();
    }, []);

     const updateProfile = async (updatedProfile: any) => {
        const user = auth.currentUser;
        if (user) {
            const userEmail = user.email;
            const docRef = doc(firestore, `users/users/${userEmail}/detail`);
            await setDoc(docRef, updatedProfile, { merge: true }); // 関数ではなくオブジェクトを渡す
            setProfile(updatedProfile);
        }
    };
    

    return (
        <ProfileContext.Provider value={{profile, updateProfile, loading}}>
            {!loading && children}
        </ProfileContext.Provider>
    )
}
