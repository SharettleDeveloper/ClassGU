'use client';

import React, { useState } from "react";
import LoginForm from "../components/Auth/Login";
import ResetPasswordForm from "../components/Auth/SendEmail";
import ForgotPasswordForm from "../components/Auth/ForgotPassword";
import { keyframes } from '@emotion/react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0.7;
    transform: translateY(0px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// グローバルスタイルの設定
const GlobalStyle = styled('style')`
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden; /* すべてのスクロールを無効に */
  }
`;

const Root = styled('div')({
    minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(60deg, #6a11cb 0%, #2575fc 100%)',
  color: '#fff',
  fontFamily: 'Noto Sans JP, sans-serif',
  width: '100%',
  margin: '0',
  padding: '0',
  overflowX: 'hidden',
  
    
})

const GradientBackground = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minheight: '100vh',
  margin: '0px',
  padding: '0px',
  background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
  backgroundSize: '200% 100%',
  color: '#fff',
  fontFamily: 'Arial, sans-serif',
  animation: `${gradientAnimation} 9s ease infinite`,
  overflowX: 'hidden',  // 余白やスクロールを防止
});

const CustomAppBar = styled(AppBar)({
  background: 'rgba(0, 0, 0, 0.7)',
  boxShadow: 'none',
  height: 64, 
//   zIndex: 1,
  backdropFilter: 'blur(0px)',
  width: '100%', 
  overflowX: 'hidden',  // 余白やスクロールを防止
});

const CustomToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflowX: 'hidden',  // 余白やスクロールを防止
});

const Footer = styled('footer')({
  padding: '1rem 0',
  textAlign: 'center',
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  width: '100%', 
  height: 64, 
  position: 'relative',
  zIndex: 1,
  backdropFilter: 'blur(10px)',
  overflowX: 'hidden',  // 余白やスクロールを防止
});

const LoginBox = styled(Box)({
  animation: `${fadeIn} 0.5s ease-out`,
//   flex: 1,
  width: '97%',
  height: '90%',
  maxHeight: '700px',
  maxWidth: '900px', 
  margin: '0 auto',
  paddingTop: '0px',
  boxSizing: 'border-box',
  backdropFilter: 'blur(5px)',
  marginTop:'100px',
  marginBottom: '20px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  overflowX: 'hidden',  // 余白やスクロールを防止
  zIndex: 1
});

const LoginPage = () => {
  const [formState, setFormState] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const [key, setKey] = useState(0);
  const router = useRouter();

  const handleSwitch = (newState: 'login' | 'register' | 'forgotPassword') => {
    setFormState(newState);
    setKey((prevKey) => prevKey + 1); 
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const currentYear = new Date().getFullYear();

  return (
    
      <GradientBackground>
        <CustomAppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }}>
          <CustomToolbar>
            <IconButton color="inherit" onClick={handleGoBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
              ClassGU
            </Typography>
            <Box sx={{ width: 48 }} />
          </CustomToolbar>
        </CustomAppBar>
        <LoginBox key={key}>
          {formState === 'login' && (
            <LoginForm
              onSwitch={() => handleSwitch('register')}
              onForgotPassword={() => handleSwitch('forgotPassword')}
            />
          )}
          {formState === 'register' && <ResetPasswordForm onSwitch={() => handleSwitch('login')} />}
          {formState === 'forgotPassword' && <ForgotPasswordForm onSwitch={() => handleSwitch('login')} />}
        </LoginBox>
        <Footer>
          <Typography variant="body2">
            &copy; {currentYear} ClassGU. Developer R.M.
          </Typography>
        </Footer>
      </GradientBackground>
    
  );
};

export default LoginPage;
