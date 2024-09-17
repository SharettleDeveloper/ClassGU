import React, { useState } from 'react';
import { IconButton, Box, Snackbar, Alert } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SchoolIcon from '@mui/icons-material/School';
import { useClassContext } from '../../Context/ClassContext';

interface ButtonProps {
  classId: string;
}

const FavoriteButton: React.FC<ButtonProps> = ({ classId }) => {
  const { favoriteClasses, toggleFavorite } = useClassContext();
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info'>('success');

  const handleFavoriteClick = () => {
    const isFavorite = favoriteClasses[classId]?.favorite;
    toggleFavorite(classId);
    setSnackbarSeverity('success');
    setSnackbarMessage(isFavorite ? 'お気に入りから削除しました' : 'お気に入りに追加しました');
  };

  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  const isFavorite = favoriteClasses[classId]?.favorite;

  return (
    <Box>
      <IconButton
        onClick={handleFavoriteClick}
        sx={{
          background: isFavorite
            ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
            : 'linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)',
          color: 'white',
          transition: 'transform 0.2s, background 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
            background: isFavorite
              ? 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)'
              : 'linear-gradient(45deg, #BDBDBD 30%, #9E9E9E 90%)',
          },
        }}
      >
        <FavoriteIcon />
      </IconButton>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const MyClassButton: React.FC<ButtonProps> = ({ classId }) => {
  const { myClasses, toggleMyClass } = useClassContext();
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info'>('success');

  const handleMyClassClick = () => {
    const isMyClass = myClasses[classId]?.myclass;
    toggleMyClass(classId);
    setSnackbarSeverity('success');
    setSnackbarMessage(isMyClass ? 'MyClassから削除しました' : 'MyClassに登録しました');
  };

  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  const isMyClass = myClasses[classId]?.myclass;

  return (
    <Box>
      <IconButton
        onClick={handleMyClassClick}
        sx={{
          background: isMyClass
            ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            : 'linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)',
          color: 'white',
          transition: 'transform 0.2s, background 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
            background: isMyClass
              ? 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)'
              : 'linear-gradient(45deg, #BDBDBD 30%, #9E9E9E 90%)',
          },
        }}
      >
        <SchoolIcon />
      </IconButton>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export { FavoriteButton, MyClassButton };
