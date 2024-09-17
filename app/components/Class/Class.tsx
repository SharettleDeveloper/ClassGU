'use client'
import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../../../firebase'; // authをインポート
import { doc, getDoc } from 'firebase/firestore';
import { Box, Divider, Paper } from '@mui/material';
import AppBar2 from '../../components/AppBar/AppBar2';
import { BackgroundProvider } from '../../Context/BackgroundContext';
import { ProfileProvider } from '../../components/AppBar/ProfileContext';
import { ClassProvider } from '@/app/Context/ClassContext';
import { keyframes } from '@mui/system';
import FileUploadModal from '../Share/ShareButton';
import ClassDetails from './ClassDetails';
import SharedFiles from '../Share/ShareShow';
import { useRouter } from 'next/navigation';
// フェードインのアニメーションを定義
const fadeAndScale = keyframes`
  from {
    transform: scale(0.98);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const Class = () => {
    const [classData, setClassData] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                // ログインしていない場合は '/' にリダイレクト
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [router]);


    useEffect(() => {
        const fetchData = async () => {
            // if (!currentUser) {
            //     console.error('User is not authenticated');
            //     // router.push('/'); // 認証されていない場合にリダイレクト
            //     return;

            // }

            const classId = localStorage.getItem('selectedClassId');
            if (classId) {
                const docRef = doc(firestore, 'class', 'class', classId, 'detail');
                try {
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        // console.log("Document data:", docSnap.data());
                        setClassData({ id: classId, ...docSnap.data() });
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                }
            } else {
                console.error('Class ID not found in localStorage');
            }
        };

        fetchData();
    }, [currentUser]);


    if (!classData || !currentUser) {
        return null; // ロード中やユーザーが存在しない場合は何も表示しない
    }

    return (
        <BackgroundProvider>
            <ProfileProvider>
                <ClassProvider>
                    <Box
                        sx={{
                            animation: `${fadeAndScale} 0.5s ease-out`,
                        }}
                    >
                        <AppBar2>
                            <Box
                                sx={{
                                    p: 1,
                                    mt: 0.5, // AppBarとの間にスペースを追加
                                    background: 'linear-gradient(330deg, #303F9F 10%, #039BE5 70%)',
                                    borderRadius: '7px',
                                    boxShadow: '0 1px 20px rgba(0, 0, 0, 0.3)',
                                    animation: `${fadeAndScale} 0.5s ease-out`,
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 1,
                                        mb: 0.5,
                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                        borderRadius: '5px',
                                    }}
                                >
                                    <ClassDetails classData={classData} />
                                </Paper>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <FileUploadModal classId={classData.id} userId={currentUser.uid} /> {/* userIdとclassIdを渡す */}
                            </Box>
                            <Divider sx={{ my: 1 }} /> {/* 上下に間隔を設定 */}
                            <Box sx={{ mt: 1 }}>
                                <SharedFiles classId={classData.id} />
                            </Box>

                        </AppBar2>
                    </Box>
                </ClassProvider>
            </ProfileProvider>
        </BackgroundProvider>
    );
};

export default Class;
