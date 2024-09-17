'use client';
import React, { useState } from "react";
import { TextField, Button, LinearProgress, Box, Typography, ThemeProvider, createTheme } from "@mui/material";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { keyframes } from '@emotion/react';
import { signOut } from "firebase/auth";
import { randomBytes } from 'crypto';

const createSecureRandomPassword = (): string => {
    return randomBytes(15).toString('base64').slice(0, 30); // 30文字のランダムなパスワードを生成
};

const sendPassResetEmail = async (email: string, setProgress: React.Dispatch<React.SetStateAction<number>>, setMessage: React.Dispatch<React.SetStateAction<string>>, router: any) => {
    
    try {
        const randomPassword = createSecureRandomPassword();
        await createUserWithEmailAndPassword(auth, email, randomPassword);
        await signOut(auth);

        for (let i = 0; i <= 100; i++) {
            setTimeout(() => setProgress(i), i * 50);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        await sendPasswordResetEmail(auth, email);


        setMessage("アカウントの作成が完了しました。パスワード設定のリンクを送信しました。送られてきたリンクからパスワードを設定してください。");
        
        // ユーザーをログインページにリダイレクト
        // router.push('/login');
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            // console.log("User already exists");

            for (let i = 0; i <= 100; i++) {
                setTimeout(() => setProgress(i), i * 50);
            }
            setMessage("アカウントの作成が完了しました。パスワード設定のリンクを送信しました。送られてきたリンクからパスワードを設定してください。");

            // ユーザーをログインページにリダイレクト
            // router.push('/login');
        } else {
            // console.error("Error sending password reset email:", error);
            setProgress(0);
            setMessage("エラーが発生しました。お手数ですがもう一度お試しください。");
        }
    }
};

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

const ResetPasswordForm = ({ onSwitch }: { onSwitch: () => void }) => {
    const [emailPrefix, setEmailPrefix] = useState("");
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
        setEmailPrefix(value);
        setShowWarning(value.includes('@'));

        const email = `${value}@s.gifu-u.ac.jp`;
        const isValid = /^[a-zA-Z0-9._-]+$/.test(value) &&
                        (value.match(/[a-zA-Z]/g)?.length ?? 0) >= 5 &&
                        /\.[a-zA-Z0-9_-]+$/.test(value) &&
                        /[a-zA-Z0-9_-]+\./.test(value);
        setEmailValid(isValid);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailValid && emailPrefix) {
            setSubmitted(true);
            const email = `${emailPrefix}@s.gifu-u.ac.jp`;
            sendPassResetEmail(email, setProgress, setMessage, router);
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
                height: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
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
                        アカウント作成
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <TextField
                            label="yamada.tarou.xx"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={emailPrefix}
                            onChange={handleChange}
                            disabled={submitted}
                            sx={{ mb: 1 }}
                            helperText={`岐阜大学のメールアドレスを入力してください。@以降は入力しなくて良いです。`}
                            error={showWarning}
                            InputProps={{
                                style: { color: '#334155' }
                            }}
                            InputLabelProps={{
                                style: { color: '#64748b' }
                            }}
                        />

                        <Typography variant="body1">{emailPrefix}@s.gifu-u.ac.jp</Typography>
                        {!submitted && (
                            <Button type="submit" variant="contained" color="primary" disabled={!emailValid || !emailPrefix}>
                                アカウントを作成
                            </Button>
                        )}
                    </form>
                    {submitted && (
                        <Box sx={{ mt: 4, animation: `${fadeIn} 0.3s ease-out` }}>
                            <LinearProgress variant="determinate" value={progress} color={"primary"} sx={{ height: 10, borderRadius: 5 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                {`${progress}%`}
                            </Typography>
                            {progress === 100 && (
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    {message}
                                </Typography>
                            )}
                        </Box>
                    )}
                    <Button
                        variant="text"
                        color="primary"
                        onClick={onSwitch}
                        sx={{ mt: 2 }}
                    >
                        ログインに戻る
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default ResetPasswordForm;
