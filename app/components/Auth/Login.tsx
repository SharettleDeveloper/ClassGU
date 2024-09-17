'use client'

import React, { useState } from "react";
import { TextField, Button, Box, Typography, ThemeProvider, createTheme, IconButton, Collapse } from "@mui/material";
import { auth, firestore } from "../../../firebase";
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from "firebase/auth";
import { keyframes } from '@emotion/react';
import { useRouter } from "next/navigation";
import CloseIcon from '@mui/icons-material/Close';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const LoginForm = ({ onSwitch, onForgotPassword }: { onSwitch: () => void, onForgotPassword: () => void }) => {
    const [emailPrefix, setEmailPrefix] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showAccountCreationPrompt, setShowAccountCreationPrompt] = useState(true); // 初期表示を true に設定
    const [showHelp, setShowHelp] = useState(false); // ヘルプ表示の状態管理

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
        setEmailPrefix(value);
    };

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = `${emailPrefix}@s.gifu-u.ac.jp`;
        try {
            await signInWithEmailAndPassword(auth, email, password);

            const user = auth.currentUser;
            if(user){
                const userEmail = user.email

                const userDocRef = doc(firestore,'users', 'users');
                const userEmailCollectionRef  = collection(userDocRef, userEmail || '');

                const querySnapshot = await getDocs(userEmailCollectionRef);

                if(querySnapshot.empty){

                    const detailRef = doc(userEmailCollectionRef,'detail');
                    await setDoc(detailRef,{
                        createdAt: new Date(),
                    })
                }

            }

            
            router.push('/dashboard');
        } catch (error: any) {
            setError("ログインに失敗しました。もう一度お試しください。");
        }
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#334155',
            },
            secondary: {
                main: '#334155',
            },
            background: {
                default: '#f4f6f8',
                paper: '#ffffff',
            },
            text: {
                primary: '#334155',
                secondary: '#64748b',
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
            h4: {
                fontSize: '1.75rem',
                fontWeight: 'bold',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                paddingTop: '10px', // ヘッダーとの間にスペースを確保
                paddingBottom: '10px',
                bgcolor: 'background.default',
                color: 'text.primary',
                overflowX: 'hidden',
            }}>
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    textAlign: 'center',
                    color: 'text.secondary',
                    width: { xs: '80%', sm: '60%', md: '40%' },
                }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        ログイン
                    </Typography>

                    {showAccountCreationPrompt && (
                        <Box sx={{ mb: 2, bgcolor: '#E0F7FA', p: 2, borderRadius: 1, position: 'relative' }}>
                            <Typography variant="body2" color="primary">
                                アカウントをお持ちでない方は、アカウントを作成してください。
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => setShowAccountCreationPrompt(false)}
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <TextField
                            label="yamada.tarou.xx"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={emailPrefix}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#334155',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#334155',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#334155',
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#334155',
                                },
                            }}
                        />
                        <Typography variant="body1">{emailPrefix}@s.gifu-u.ac.jp</Typography>
                        <TextField
                            id="password"
                            type="password"
                            value={password}
                            label="Password"
                            variant="outlined"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#334155',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#334155',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#334155',
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#334155',
                                },
                            }}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            ログイン
                        </Button>
                        {error && (
                            <Typography variant="body2" color="error">
                                {error}
                            </Typography>
                        )}
                    </form>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={onSwitch}
                        >
                            アカウント作成
                        </Button>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={onForgotPassword}
                        >
                            パスワードを忘れた場合
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => setShowHelp(!showHelp)}
                        >
                            ヘルプ
                        </Button>
                        <Collapse in={showHelp}>
                            <Box sx={{ mt: 2, bgcolor: '#E3F2FD', p: 2, borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Q: パスワードは岐阜大学のものですか？</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    A: いいえ、初回のパスワードはアカウント作成時にパスワードを設定するメールが送られてきますので、そちらから設定してください。
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Q: ログインできません。</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    A: アカウントは作成済みですか？まだの方はアカウントを作成してください。
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Q: パスワードを忘れました。</strong>
                                </Typography>
                                <Typography variant="body2">
                                    A: パスワードを忘れた場合はパスワードを再設定できます。この場合はアカウントを登録済みの方のみに再設定用のメールが送られます。
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Q: アカウント作成後にパスワードを設定するメールが届きません。</strong>
                                </Typography>
                                <Typography variant="body2">
                                    A: メールが迷惑メールフォルダに振り分けられていないか確認してください。また、メールアドレスを正確に入力したか確認し、それでも届かない場合は、パスワードを再設定してみてください。
                                </Typography>
                            </Box>
                        </Collapse>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default LoginForm;
