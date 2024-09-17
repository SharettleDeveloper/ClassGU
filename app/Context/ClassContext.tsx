'use client';
// src/contexts/ClassContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firestore } from '../../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { deleteField } from 'firebase/firestore';
import { useAuth } from '../components/Auth/AuthContext';

interface ClassData {
  cN: string; // 授業名
  ins: string; // 教師
  dWk: string; // 曜日
  prd: string; // 時限
  trm: string; // 学期
  loc: string; //教室
  favorite?: boolean;
  myclass?: boolean;
}

interface ClassContextType {
  favoriteClasses: { [key: string]: ClassData };
  myClasses: { [key: string]: ClassData };
  setFavoriteClasses: React.Dispatch<React.SetStateAction<{ [key: string]: ClassData }>>;
  setMyClasses: React.Dispatch<React.SetStateAction<{ [key: string]: ClassData }>>;
  toggleFavorite: (classId: string) => void;
  toggleMyClass: (classId: string) => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClassContext must be used within a ClassProvider');
  }
  return context;
};

export const ClassProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [favoriteClasses, setFavoriteClasses] = useState<{ [key: string]: ClassData }>({});
  const [myClasses, setMyClasses] = useState<{ [key: string]: ClassData }>({});

  useEffect(() => {
    if (!currentUser) return;

    const userDocRef = doc(firestore, `users/users/${currentUser.email}/myclass`);

    // Firestoreのリアルタイムリスナーを設定
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavoriteClasses(
          Object.fromEntries(
            Object.entries(data).filter(([_, val]: [string, any]) => val.favorite).map(([classId, val]: [string, any]) => [classId, val])
          )
        );
        setMyClasses(
          Object.fromEntries(
            Object.entries(data).filter(([_, val]: [string, any]) => val.myclass).map(([classId, val]: [string, any]) => [classId, val])
          )
        );
      } else {
        setFavoriteClasses({});
        setMyClasses({});
      }
    });

    return () => unsubscribe(); // コンポーネントがアンマウントされたときにリスナーを解除
  }, [currentUser]);

  const toggleFavorite = async (classId: string) => {
    if (!currentUser) return;

    const classDocRef = doc(firestore, `class/class/${classId}/detail`);
    const classDocSnap = await getDoc(classDocRef);

    if (classDocSnap.exists()) {
      const classData = classDocSnap.data();
      const { cN, ins, dWk, prd, trm, loc } = classData;

      const newFavoriteStatus = !favoriteClasses[classId]?.favorite;
      const updatedData = {
        cN,
        ins,
        dWk,
        prd,
        trm,
        loc,
        favorite: newFavoriteStatus,
        myclass: myClasses[classId]?.myclass || false, // myClasses から myclass ステータスを取得
      };

      if (!newFavoriteStatus && !updatedData.myclass) {
        // favorite と myclass がどちらも false なら削除
        setFavoriteClasses(prev => {
          const { [classId]: _, ...rest } = prev;
          return rest;
        });

        const userDocRef = doc(firestore, `users/users/${currentUser.email}/myclass`);
        await setDoc(userDocRef, { [classId]: deleteField() }, { merge: true });
      } else {
        if (newFavoriteStatus) {
          setFavoriteClasses(prev => ({ ...prev, [classId]: updatedData }));
        } else {
          setFavoriteClasses(prev => {
            const { [classId]: _, ...rest } = prev;
            return rest;
          });
        }

        const userDocRef = doc(firestore, `users/users/${currentUser.email}/myclass`);
        await setDoc(userDocRef, { [classId]: updatedData }, { merge: true });
      }
    } else {
      console.error('Document does not exist');
    }
  };


  // toggleMyClass関数の修正
  const toggleMyClass = async (classId: string) => {
    if (!currentUser) return;

    const classDocRef = doc(firestore, `class/class/${classId}/detail`);
    const classDocSnap = await getDoc(classDocRef);

    if (classDocSnap.exists()) {
      const classData = classDocSnap.data();
      const { cN, ins, dWk, prd, trm, loc } = classData;

      const newMyClassStatus = !myClasses[classId]?.myclass;
      const updatedData = {
        cN,
        ins,
        dWk,
        prd,
        trm,
        loc,
        favorite: favoriteClasses[classId]?.favorite || false,
        myclass: newMyClassStatus,
      };

      if (!updatedData.favorite && !newMyClassStatus) {
        // favorite と myclass がどちらも false なら削除
        setMyClasses(prev => {
          const { [classId]: _, ...rest } = prev;
          return rest;
        });

        const userDocRef = doc(firestore, `users/users/${currentUser.email}/myclass`);
        await setDoc(userDocRef, { [classId]: deleteField() }, { merge: true });
      } else {
        if (newMyClassStatus) {
          setMyClasses(prev => ({ ...prev, [classId]: updatedData }));
        } else {
          setMyClasses(prev => {
            const { [classId]: _, ...rest } = prev;
            return rest;
          });
        }

        const userDocRef = doc(firestore, `users/users/${currentUser.email}/myclass`);
        await setDoc(userDocRef, { [classId]: updatedData }, { merge: true });
      }
    } else {
      console.error('Document does not exist');
    }
  };


  return (
    <ClassContext.Provider value={{ favoriteClasses, myClasses, setFavoriteClasses, setMyClasses, toggleFavorite, toggleMyClass }}>
      {children}
    </ClassContext.Provider>
  );
};
