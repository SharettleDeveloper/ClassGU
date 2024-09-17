'use client';
import React, { ReactNode, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Button, IconButton, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { auth } from '../../../firebase';
import ProfileModal from './ProfileEdit';
import { useProfile } from './ProfileContext';
import { useBackground } from '@/app/Context/BackgroundContext';
import SettingsModal from './SettingsModal';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Grid, Link } from '@mui/material';
interface AppProps {
  children: ReactNode;
}

const AppBar1 = ({ children }: AppProps) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isBgModalOpen, setBgModalOpen] = useState(false);

  const { profile } = useProfile() || {};
  const { backgroundUrl } = useBackground();

  const currentYear = new Date().getFullYear();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      // console.error('ログアウトに失敗しました：', error);
    }
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
    handleClose();
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const openBgModal = () => {
    setBgModalOpen(true);
    handleClose();
  };

  const closeBgModal = () => {
    setBgModalOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
            ClassGU

          </Typography>
          <div>
            <IconButton></IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {profile && profile.photoURL ? (
                <Avatar alt={profile.displayName || ''} src={profile.photoURL} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {profile ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1">{profile.displayName}</Typography>
                  <Avatar alt={profile.displayName || ''} src={profile.photoURL} sx={{ width: 56, height: 56, margin: '0 auto' }} />
                  <Typography variant="body2">{profile.email}</Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1">ゲスト</Typography>
                  <AccountCircle sx={{ width: 56, height: 56, margin: '0 auto' }} />
                  <Typography variant="body2">プロフィールを登録してください</Typography>
                </Box>
              )}

              <Divider />
              <MenuItem onClick={openProfileModal}>プロフィール</MenuItem>
              {/* <MenuItem onClick={() => { handleClose(); router.push('/myclass'); }}>My時間割</MenuItem> */}
              <MenuItem onClick={() => { handleClose(); router.push('/ShareManage'); }}>共有一覧</MenuItem>
              <MenuItem onClick={openBgModal}>設定</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(10deg, #303F9F 30%, #039BE5 90%)',
          color: '#fff',
          pt: 3,
          pb: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={5}>
              <Typography variant="h6" gutterBottom>
                ClassGU
              </Typography>
              <Typography variant="body2">
                This is a learning platform for Gifu University students.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3} />
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">developer@sharettle.com</Typography>
              <Typography variant="body2">090-xxxx-xxxx</Typography>
            </Grid>
          </Grid>
          <Box mt={5} textAlign="center">
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              &copy; {currentYear} ClassGU by Sharettle. Developer R.M.
            </Typography>
          </Box>
        </Container>
      </Box>
      {profile && (
        <ProfileModal
          open={isProfileModalOpen}
          onClose={closeProfileModal}
          user={auth.currentUser}
          photoURL={profile.photoURL}
        />
      )}

      {/* ここで SettingsModal を使用 */}
      <SettingsModal open={isBgModalOpen} onClose={closeBgModal} />
    </Box>
  );
};

export default AppBar1;
