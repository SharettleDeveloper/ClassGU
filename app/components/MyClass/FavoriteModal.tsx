import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Divider, Modal, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { useClassContext } from '../../Context/ClassContext';
import { MyClassButton } from './ClassButton';

interface FavoriteClassesModalProps {
    open: boolean;
    onClose: () => void;
}

const FavoriteClassesModal: React.FC<FavoriteClassesModalProps> = ({ open, onClose }) => {
    const { favoriteClasses } = useClassContext();
    const router = useRouter();

    const handleClassClick = (classId: string) => {
        localStorage.setItem('selectedClassId', classId);
        router.push(`/Class`);
        onClose();
    };

    const sortedClassIds = Object.keys(favoriteClasses).sort((a, b) => {
        return favoriteClasses[a].cN.localeCompare(favoriteClasses[b].cN);
    });

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'traslator',
                        opacity: 0.4, // Backdropの背景色を設定
                        // その他のスタイルプロパティを必要に応じて追加
                    },
                    timeout: 500, // トランジションのタイムアウト
                },
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        p: 2.2,
                        width: '90%',
                        maxWidth: 1200,
                        margin: 'auto',
                        mt: '10%',
                        backgroundColor: '#F8BBD0', // ソフトなピンク色の背景
                        borderRadius: '1rem',
                        boxShadow: '0 4px 20px rgba(244, 114, 182, 0.15)', // ピンク色の影
                        color: '#4B5563', // ダークグレーのテキスト
                        fontFamily: '"Helvetica Neue", Arial, sans-serif',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 15,
                            color: '#EC4899', // ビビッドなピンク色のアイコン
                            zIndex: 1300,
                            '&:hover': {
                                backgroundColor: 'rgba(236, 72, 153, 0.1)', // ホバー時の背景色
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '1rem',
                            background: 'linear-gradient(45deg, #FF4081 20%, #F50057 90%)', // ピンクのグラデーション
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent', // テキストを透明にして背景をクリップ
                            textShadow: '0 1px 2px rgba(190, 24, 93, 0.2)', // テキストに軽い影
                        }}
                    >
                        お気に入り
                    </Typography>


                    {/* <Divider sx={{ mb: 2, backgroundColor: '#fff' }} /> */}
                    {Object.keys(favoriteClasses).length > 0 ? (
                        <List
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
                                gap: 0.7,
                            }}
                        >
                            {sortedClassIds.map((classId) => {
                                const classData = favoriteClasses[classId];

                                if (!classData || !classData.favorite) return null;

                                return (
                                    <Paper
                                        key={classId}

                                        sx={{

                                            p: 0.3,
                                            backgroundColor: 'rgba(255, 255, 255, 1)',
                                            borderRadius: '17px',
                                            transition: 'transform 0.2s ease-in-out, background 0.1s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.01)', // 少し大きくなる動きを追加
                                                backgroundColor: 'rgba(255, 255, 255, 1)', // ホバー時の背景色を白に設定
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ListItem
                                                button
                                                onClick={() => handleClassClick(classId)}
                                                sx={{
                                                    flexGrow: 1,
                                                    '&:hover': {
                                                        backgroundColor: 'transparent', // ホバー時の背景色を透明にする
                                                    },
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontSize: { xs: '0.8rem', sm: '0.65rem', md: '1.0rem', lg: '1rem' }, // デバイスごとのフォントサイズ
                                                                color: '#37474f',
                                                            }}
                                                        >
                                                            {classData.cN}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="textSecondary"
                                                                sx={{
                                                                    fontSize: { xs: '0.6rem', sm: '0.6rem', md: '1rem', lg: '0.9rem' }, // デバイスごとのフォントサイズ
                                                                }}
                                                            >
                                                                教員: {classData.ins}
                                                            </Typography>
                                                            <br />
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="textSecondary"
                                                                sx={{
                                                                    fontSize: { xs: '0.6rem', sm: '0.6rem', md: '1rem', lg: '0.9rem' }, // デバイスごとのフォントサイズ
                                                                }}
                                                            >
                                                                時間: {classData.trm}期 / {classData.dWk}曜 / {classData.prd}限
                                                            </Typography>
                                                        </>
                                                    }
                                                    sx={{
                                                        color: '#37474f',
                                                    }}
                                                />
                                            </ListItem>

                                            <Box sx={{ mr: 1 }}>
                                                <MyClassButton classId={classId} />
                                            </Box>
                                        </Box>
                                    </Paper>
                                );
                            })}

                        </List>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            お気に入りに登録されている授業はありません。
                        </Typography>
                    )}
                </Box>
            </Fade>
        </Modal>

    );
};

export default FavoriteClassesModal;
