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

const fadeIn = keyframes`
  from {
    opacity: 0.9;
    transform: scale(1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const CustomAppBar = styled(AppBar)({
  // background: 'rgba(0, 0, 0, 0.5)',
  boxShadow: 'none',
  height: 55, // ヘッダーの高さを固定
  zIndex: 1, // AppBarを前面に固定
});

const CustomToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
   background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)'
});

const Footer = styled('footer')({
  padding: '1rem 0',
  textAlign: 'center',
  background: '#2E3B55',
  color: '#fff',
  width: '100%',
  height: 64, // フッターの高さを固定
  position: 'relative',
  zIndex: 1, // Footerを前面に固定
});

const LoginPage = () => {
  const [formState, setFormState] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const [key, setKey] = useState(0);
  const router = useRouter();

  const handleSwitch = (newState: 'login' | 'register' | 'forgotPassword') => {
    setFormState(newState);
    setKey((prevKey) => prevKey + 1); // コンポーネントをリレンダリングするためのキーを変更
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      minHeight: '100vh', 
      // background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)', 
      color: '#fff', 
      fontFamily: 'Arial, sans-serif', 
      overflowX: 'hidden', 
      margin: 0,
      padding: 0,
    }}>
      <CustomAppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }}>
        <CustomToolbar>
          <IconButton color="inherit" onClick={handleGoBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            ClassGU
          </Typography>
          <Box sx={{ width: 48 }} /> {/* 右側のスペースを確保するためのダミー要素 */}
        </CustomToolbar>
      </CustomAppBar>
      <Box 
        key={key} 
        sx={{ 
          animation: `${fadeIn} 0.5s ease-out`,  // 修正: `${}` で囲む
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden', 
          height: 'calc(100vh - 128px)', 
          padding: '0px', 
          width: '100%', 
          paddingTop: '64px', // AppBarの高さを考慮してトップに余白を作る
          boxSizing: 'border-box',
          
        }}>
        {formState === 'login' && (
          <LoginForm
            onSwitch={() => handleSwitch('register')}
            onForgotPassword={() => handleSwitch('forgotPassword')}
          />
        )}
        {formState === 'register' && <ResetPasswordForm onSwitch={() => handleSwitch('login')} />}
        {formState === 'forgotPassword' && <ForgotPasswordForm onSwitch={() => handleSwitch('login')} />}
      </Box>
      <Footer>
        <Typography variant="body2">
          &copy; {currentYear} ClassGU. Developer R.M.
        </Typography>
      </Footer>
    </Box>
  );
};

export default LoginPage;
