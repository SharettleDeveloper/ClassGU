import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Slider, Grid, Backdrop, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useBackground } from '@/app/Context/BackgroundContext';
import { Rnd } from 'react-rnd';
import OpenWithIcon from '@mui/icons-material/OpenWith'; // 交差矢印アイコン

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const { backgroundUrl, setBackgroundUrl, backgroundSize, setBackgroundSize, positionX, setPositionX, positionY, setPositionY } = useBackground();
  const [url, setUrl] = useState<string>(backgroundUrl);
  const [size, setSize] = useState<number>(parseFloat(backgroundSize) || 100);
  const [localPositionX, setLocalPositionX] = useState<number>(parseFloat(positionX) || 50);
  const [localPositionY, setLocalPositionY] = useState<number>(parseFloat(positionY) || 50);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    setBackgroundUrl(url); // URLが変更された時点で即時反映
  }, [url, setBackgroundUrl]);

  useEffect(() => {
    setBackgroundSize(`${size}%`); // サイズが変更された時点で即時反映
  }, [size, setBackgroundSize]);

  useEffect(() => {
    const newPosX = `${localPositionX}%`;
    const newPosY = `${localPositionY}%`;
    setPositionX(newPosX);
    setPositionY(newPosY);
  }, [localPositionX, localPositionY, setPositionX, setPositionY]);

  const handleSave = () => {
    onClose(); // 変更内容はリアルタイムで反映されているので、保存時に追加の処理は不要
  };

  if (!open) return null; // モーダルが開いていないときは何も表示しない

  return (
    <>
      <Backdrop open={open} sx={{ zIndex: 10 }} onClick={onClose} />
      <Rnd
        default={{
          x: 50,
          y: 50,
          width: isSmallScreen ? 300 : isMediumScreen ? 400 : 500, // 画面サイズに応じて幅を変更
          height: 'auto',
        }}
        bounds="window"
        enableResizing={false} // モーダルのサイズは変更不可にする
        dragHandleClassName="drag-handle" // ドラッグ可能エリアを指定
        style={{
          zIndex: 11,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" gutterBottom>
              背景画像の設定
            </Typography>
            <IconButton className="drag-handle" aria-label="move" size="small">
              <OpenWithIcon />
            </IconButton>
          </Box>
          <TextField
            label="画像URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" gutterBottom>
            画像サイズ ({size}%)
          </Typography>
          <Slider
            value={size}
            onChange={(e, newValue) => setSize(newValue as number)}
            aria-labelledby="size-slider"
            min={10}
            max={200}
            step={1}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                X位置 ({localPositionX}%)
              </Typography>
              <Slider
                value={localPositionX}
                onChange={(e, newValue) => setLocalPositionX(newValue as number)}
                aria-labelledby="position-x-slider"
                min={0}
                max={200}
                step={1}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                Y位置 ({localPositionY}%)
              </Typography>
              <Slider
                value={localPositionY}
                onChange={(e, newValue) => setLocalPositionY(newValue as number)}
                aria-labelledby="position-y-slider"
                min={0}
                max={100}
                step={1}
              />
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" onClick={handleSave} fullWidth sx={{ mt: 2 }}>
            保存
          </Button>
        </Box>
      </Rnd>
    </>
  );
};

export default SettingsModal;
