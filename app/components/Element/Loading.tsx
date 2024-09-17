import { CircularProgress, Typography, Box } from '@mui/material';

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      sx={{
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6" sx={{ marginTop: '20px', fontFamily: 'Noto Sans JP, sans-serif' }}>
        Loading ClassGU
      </Typography>
    </Box>
  );
};

export default Loading;
