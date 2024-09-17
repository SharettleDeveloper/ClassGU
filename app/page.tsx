'use client';

import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { useState } from 'react';

import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import CommentIcon from '@mui/icons-material/Comment';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { keyframes } from '@mui/system';


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
});

const Main = styled(Box)(({ height }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'center',
  animation: 'fadeIn 1.5s ease-in-out',
  width: '100%',
  padding: '0',
  overflowY: 'auto',
  overflowX: 'hidden',
  boxSizing: 'border-box',
  height: height ? `${height}px` : 'auto',
}));

const CustomAppBar = styled(AppBar)({
  background: 'rgba(0, 0, 0, 0.5)',
  boxShadow: 'none',
  color: '#fff',
  position: 'relative',
  width: '100%',
});

const CustomToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '0 20px',
  boxSizing: 'border-box',
  minHeight: '64px', // AppBarの高さを明示的に設定
});

const Footer = styled('footer')({
  padding: '1rem 0',
  textAlign: 'center',
  background: '#334155',
  color: '#fff',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: 'auto', // フッターを下部に固定
});

const Section = styled(Box)({
  margin: '3rem 0',
  width: '100%',
});

const AnimatedText = styled(Typography)({
  animation: 'slideIn 1.2s ease-in-out',
});

const AnimatedButton = styled(Button)({
  animation: 'slideIn 5.0s ease-in-out'
});

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const StylishAnimatedButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 30,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 60,
  padding: '0 30px',
  transition: 'all 3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    transform: 'rotate(30deg)',
    animation: `${shimmer} 6s infinite linear`,
  },
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
    boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
    transform: 'translateY(-3px) scale(1.02)',
  },
}));


const fadeIn = `
  @keyframes fadeIn {
    0% { opacity: 0 }
    100% { opacity: 1 }
  }
`;

const slideIn = `
  @keyframes slideIn {
    0% { transform: translateY(-15px); opacity: 0 }
    100% { transform: translateY(0); opacity: 1 }
  }
`;

const currentYear = new Date().getFullYear();

const Home: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // ログイン中を示す状態

  const handleLogin = () => {
    if (!loading) {
      setLoading(true);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
        setLoading(false); // ログイン処理が終わったらボタンを有効にする
        unsubscribe();
      });
    }
  };

  

  return (
    <Root>
      <Head>
        <title>ClassGU Sharettle</title>
        <meta name="description" content="ClassGU - 岐阜大学生のための最高の学習プラットフォーム" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        
      </Head>

      <style jsx global>{`
        ${fadeIn}
        ${slideIn}
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
      <CustomAppBar position="static">
        <CustomToolbar>
          <div>
            <h3>ClassGU</h3>
          </div>
          <div>
            <AnimatedText>


              <Button color="inherit" variant="outlined" onClick={handleLogin} disabled={loading}>
                <h3 style={{ margin: 0 }}>ログイン</h3>
              </Button>
            </AnimatedText>
          </div>
        </CustomToolbar>
      </CustomAppBar>

      <Main>
        <Section>
          <Box mb={4} textAlign="center">
            <AnimatedText variant="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '3rem', md: '5rem' }, fontFamily: 'Noto Serif JP, serif' }}>
              ClassGU
            </AnimatedText>
          </Box>
          <Box mb={10} textAlign="center">
            <AnimatedText variant="h4">岐阜大学生のための学びのプラットフォーム</AnimatedText>
          </Box>
          <Box mb={10} textAlign="center">
            <StylishAnimatedButton
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'Noto Sans JP, sans-serif' }}>
                ログイン / 新規登録
              </Typography>
            </StylishAnimatedButton>
          </Box>
          <Box mb={3} textAlign="center">
            <AnimatedText variant="h4">ClassGUについて</AnimatedText>
          </Box>
          <Box mb={3} textAlign="center">
            <AnimatedText variant="h6">
              ClassGUは学びのプラットフォームです。みなさんで知識、知恵を共有し最高の学びの場を作りましょう。
            </AnimatedText>
          </Box>
          <Box mb={4} textAlign="center">
            <AnimatedText variant="h6" sx={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
              ClassGUは、学生の皆さんを最高の学習環境へと導きます。
            </AnimatedText>
          </Box>
        </Section>

        <Section>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={11} sm={5.9} md={2.9}>
              <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)', height: '70%' }}>
                <Box mb={2}>
                  <ShareIcon sx={{ fontSize: 50, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  知識の共有
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  自分の学びを他の学生と共有し、お互いを高め合いましょう。
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={11} sm={5.9} md={3}>
              <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)', height: '70%' }}>
                <Box mb={2}>
                  <PersonIcon sx={{ fontSize: 50, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  匿名でもっと気軽に
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  特定の誰かに情報提供を求める必要はありません。ここには7000人の仲間がいます。
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={11} sm={5.9} md={3}>
              <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)', height: '70%' }}>
                <Box mb={2}>
                  <FilterListIcon sx={{ fontSize: 50, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  必要な情報を素早く
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  最適なフィルタリングで必要な学習リソースをすぐに見つけられます。
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={11} sm={5.9} md={2.9}>
              <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)', height: '70%' }}>
                <Box mb={2}>
                  <CommentIcon sx={{ fontSize: 50, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  仲間と繋がる
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', fontFamily: 'Noto Sans JP, sans-serif' }}>
                  同じ目標を持つ仲間と情報交換し、助け合いましょう。
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Section>

      </Main>

      <Footer>
        <Typography variant="body2" sx={{ color: '#fff', fontFamily: 'Noto Sans JP, sans-serif' }}>
          &copy; {currentYear} ClassGU. Developer R.M.
        </Typography>
      </Footer>

    </Root>
  );
};

export default Home;






