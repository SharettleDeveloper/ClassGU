import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation'; // Next.jsのルーターをインポート
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FavoriteClassesModal from '../MyClass/FavoriteModal'; // モーダルコンポーネントをインポート
import { Schedule as ScheduleIcon } from '@mui/icons-material';
import MyClassModal from '../MyClass/MyClassModal';
import ProfileModal from '../AppBar/ProfileEdit';
import { useProfile } from '../AppBar/ProfileContext';
import { auth } from '@/firebase';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import AddClassModal from '../addClass/AddClass';

const CardGallery: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false); // My時間割モーダルの開閉状態を管理
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const router = useRouter();
    const [isAddClassModalOpen, setIsAddClassModal] = useState(false);
    const [maxScroll, setMaxScroll] = useState(0); // 最大スクロール位置を追跡

    const updateScrollPosition = () => {
        if (scrollRef.current) {
            const newPosition = scrollRef.current.scrollLeft;
            setScrollPosition(newPosition);
            setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
        }
    }, []);


    const scrollLeft = () => {
        if (scrollRef.current) {
            const newPosition = Math.max(scrollPosition - 300, 0);
            scrollRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
            setScrollPosition(newPosition);
        }
    };

    const { profile } = useProfile() || {};

    const scrollRight = () => {
        if (scrollRef.current) {
            const newPosition = Math.min(scrollPosition + 300, scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
            scrollRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
            setScrollPosition(newPosition);
        }
    };

    const handleAddClass = () => {
        setIsAddClassModal(true);
    };
    const handleCloseAddClass = () => {
        setIsAddClassModal(false);
    }

    const handleOpenShared = () => {
        // console.log('共有ボタンが押されました');
        router.push('/ShareManage/')
    };

    const handleViewFavorites = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleViewTimetable = () => {
        setIsTimetableModalOpen(true); // My時間割モーダルを開く
    };

    const handleCloseTimetableModal = () => {
        setIsTimetableModalOpen(false); // My時間割モーダルを閉じる
    };

    const openProfileModal = () => {
        setProfileModalOpen(true);
    };

    const closeProfileModal = () => {
        setProfileModalOpen(false);
    };

    const cards = [
        { title: 'My時間割', icon: <ScheduleIcon />, action: '見る', color: '#A5D6A7', onClick: handleViewTimetable }, // グリーン系パステルカラー
        { title: '授業を追加', icon: <AddIcon />, action: '追加', color: '#FFCC80', onClick: handleAddClass }, // オレンジ系パステルカラー
        { title: 'お気に入り', icon: <FavoriteIcon />, action: '見る', color: '#F48FB1', onClick: handleViewFavorites }, // ピンク系パステルカラー
        { title: '共有', icon: <ShareRoundedIcon />, action: '確認', color: '#90CAF9', onClick: handleOpenShared }, // ブルー系パステルカラー
        { title: 'プロフィール', icon: <AccountBoxRoundedIcon />, action: '編集', color: '#FFAB91', onClick: openProfileModal }, // サーモン系パステルカラー
    ];



    return (
        <Box sx={{ position: 'relative', mt: 10, px: 2 }}>
            <>
                {!isSmallScreen && scrollPosition > 0 && (
                    <IconButton
                        onClick={scrollLeft}
                        sx={{
                            position: 'absolute',
                            left: 20,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            bgcolor: 'rgba(255,255,255,0.7)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                )}
                {!isSmallScreen && scrollPosition < maxScroll && (
                    <IconButton
                        onClick={scrollRight}
                        sx={{
                            position: 'absolute',
                            right: 20,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            bgcolor: 'rgba(255,255,255,0.7)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                )}
            </>

            <Box
                ref={scrollRef}
                onScroll={updateScrollPosition}
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',
                    gap: 2,
                    py: 2,
                }}
            >
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        sx={{
                            width: isSmallScreen ? '45vw' : 200,
                            height: isSmallScreen ? '45vw' : 200,
                            flexShrink: 0,
                            borderRadius: 4,
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                            },
                            bgcolor: card.color,
                            cursor: 'pointer',  // カード全体をクリック可能にするためのカーソル変更
                        }}
                        onClick={card.onClick}  // カード全体がクリック可能になる
                    >
                        <CardContent sx={{ flex: '1 1 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontSize: isSmallScreen ? '3.5vw' : '1.2rem',
                                    mb: 2,
                                    color: 'white',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {card.title}
                            </Typography>
                            <Box
                                sx={{
                                    color: 'white',
                                    p: 0,
                                    fontSize: isSmallScreen ? '7vw' : '2rem',
                                    margin: '0 auto',
                                }}
                            >
                                {card.icon}
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
                            <Button
                                size="medium"
                                sx={{
                                    fontSize: isSmallScreen ? '3vw' : '0.9rem',
                                    color: 'white',
                                    border: '1px solid white',
                                    borderRadius: 20,
                                    px: 2,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                                }}
                            >
                                {card.action}
                            </Button>
                        </CardActions>
                    </Card>
                ))}

            </Box>

            {/* モーダルを追加 */}
            <FavoriteClassesModal open={isModalOpen} onClose={handleCloseModal} />
            <MyClassModal open={isTimetableModalOpen} onClose={handleCloseTimetableModal} />
            <ProfileModal
                open={isProfileModalOpen}
                onClose={closeProfileModal}
                user={auth.currentUser}
                photoURL={profile?.photoURL || '/default-profile.png'} // デフォルトの画像を指定
            />

            <AddClassModal open={isAddClassModalOpen} onClose={handleCloseAddClass} />

        </Box>
    );
};

export default CardGallery;
