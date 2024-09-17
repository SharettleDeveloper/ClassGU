'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, Grid, Fade, Paper, useMediaQuery, useTheme, ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import CloseIcon from '@mui/icons-material/Close'; // CloseIconをインポート
import { useClassContext } from '../../Context/ClassContext';
import { useRouter } from 'next/navigation';
import { firestore, auth } from '@/firebase';
import { updateDoc, doc } from 'firebase/firestore';



interface MyClassModalProps {
    open: boolean;
    onClose: () => void;
}

const weekdays = ['月', '火', '水', '木', '金'];
const periods = ['1', '2', '3', '4', '5'];

const MyClassModal: React.FC<MyClassModalProps> = ({ open, onClose }) => {

    const { favoriteClasses } = useClassContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();

    const [editMode, setEditMode] = useState(false); // 編集モードの状態を管理
    const [editingClass, setEditingClass] = useState<string | null>(null); // 型を string | null に設定
    // 編集中の授業を管理する状態
    const [className, setClassName] = useState('');
    const [classLocation, setClassLocation] = useState('');
    const [classDay, setClassDay] = useState('');
    const [classPeriod, setClassPeriod] = useState('');


    const toggleEditMode = () => setEditMode(!editMode);

    useEffect(() => {
        if (!open) {
            setEditMode(false); // モーダルが閉じられたときに編集モードをオフにする
        }
    }, [open]);

    const renderClassForCell = (day: string, period: string) => {
        const classEntry = Object.entries(myClasses).find(
            ([classId, classData]) => classData.dWk === day && classData.prd === period && classData.myclass === true
        );

        if (classEntry) {
            const [classId, classData] = classEntry;

            return (
                <Paper
                    elevation={1}
                    sx={{
                        p: 0.5,
                        height: '90%',
                        width: '90%',
                        minHeight: {
                            xs: 110,
                            sm: 120,
                            md: 130,
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'transform 0.2s, background-color 0.3s',
                        mb: 3,
                        '&:hover': {
                            transform: 'scale(1.02)',
                            backgroundColor: editMode ? '#F8BBD0' : '#BBDEFB'
                        },
                    }}
                    onClick={() => {
                        if (editMode) {
                            // 編集モードなら編集モーダルを開く
                            setEditingClass(classId);
                            setClassName(classData.cN);
                            setClassLocation(classData.loc);
                            setClassDay(classData.dWk);
                            setClassPeriod(classData.prd);
                        } else {
                            // 通常モードならその授業を表示するページへ遷移
                            localStorage.setItem('selectedClassId', classId);
                            router.push('/Class');
                        }
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight="normal"
                        align="center"
                        sx={{
                            fontSize: {
                                xs: '0.5rem',
                                sm: '0.7rem',
                                md: '0.8rem',
                            },
                            lineHeight: 1.5,
                        }}
                    >
                        {classData.cN}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        align="center"
                        sx={{
                            fontSize: {
                                xs: '0.5rem',
                                sm: '0.6rem',
                                md: '0.7rem',
                            },
                            lineHeight: 1.5,
                        }}
                    >
                        {classData.loc}
                    </Typography>
                </Paper>
            );
        }

        return (
            <Paper
                elevation={1}
                sx={{
                    p: 0.5,
                    height: '90%',
                    width: '90%',
                    minHeight: {
                        xs: 110,
                        sm: 120,
                        md: 130,
                    },
                    backgroundColor: 'rgba(245, 245, 245, 0.9)',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                    sx={{
                        fontSize: {
                            xs: '0.6rem',
                            sm: '0.7rem',
                            md: '0.8rem',
                        },
                    }}
                >
                    空きコマ
                </Typography>
            </Paper>
        );
    };

    const { setFavoriteClasses, myClasses, setMyClasses, toggleMyClass } = useClassContext();
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const handleRemoveClass = () => {
        if (editingClass) {
            toggleMyClass(editingClass); // 授業を削除
            setEditingClass(null); // モーダルを閉じる
            setConfirmModalOpen(false); // 確認モーダルを閉じる
        }
    };

    const openConfirmModal = () => {
        setConfirmModalOpen(true); // 確認モーダルを表示
    };

    const closeConfirmModal = () => {
        setConfirmModalOpen(false); // 確認モーダルを閉じる
    };


    const handleSaveChanges = async () => {
        const currentUser = auth.currentUser; // 現在のユーザーを取得
        if (currentUser && editingClass) {
            const userDocRef = doc(firestore, `users/users/${currentUser.email}/myclass`);

            // 既存の授業との重複をチェック
            const existingClass = Object.entries(myClasses).find(
                ([classId, classData]) => classData.dWk === classDay && classData.prd === classPeriod && classId !== editingClass
            );

            if (existingClass) {
                alert("その時間は別の授業が登録されています。");
                return; // 保存処理を中断
            }

            // Firestoreへの保存
            await updateDoc(userDocRef, {
                [`${editingClass}.cN`]: className,
                [`${editingClass}.loc`]: classLocation,
                [`${editingClass}.dWk`]: classDay,
                [`${editingClass}.prd`]: classPeriod,
            });

            setMyClasses(prev => {
                if (!prev[editingClass]?.myclass) {
                    // myclass が false ならリストから削除
                    const { [editingClass]: _, ...rest } = prev;
                    return rest;
                }
                return {
                    ...prev,
                    [editingClass]: {
                        ...prev[editingClass],
                        cN: className,
                        loc: classLocation,
                        dWk: classDay,
                        prd: classPeriod,
                        myclass: true, // 編集後のデータを更新
                    }
                };
            });


            setEditingClass(null); // モーダルを閉じる
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'traslator',

                        // その他のスタイルプロパティを必要に応じて追加
                    },
                    timeout: 500, // トランジションのタイムアウト
                },
            }}
        >
            <Fade in={open}>
                <Box>
                    <Box
                        sx={{
                            p: { xs: 1, sm: 2 },
                            backgroundColor: editMode ? '#F48FB1' : '#A5D6A7',
                            transition: 'background-color 1s ease',
                            maxHeight: 'calc(100vh - 10px)', // 画面全体から少し余白を残した高さに設定
                            margin: 'auto',
                            width: isMobile ? '95%' : '90%',
                            maxWidth: 900,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            borderRadius: { xs: 2, sm: 4 },
                            boxShadow: 4,
                            mt: 2, // 上部に少し余白を追加
                            mb: 2, // 下部に少し余白を追加

                            '&::-webkit-scrollbar': {
                                display: 'none', // Webkitベースのブラウザでスクロールバーを非表示
                            },
                            '-ms-overflow-style': 'none', // Internet Explorer用にスクロールバーを非表示
                            'scrollbar-width': 'none', // Firefox用にスクロールバーを非表示

                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            {/* 左側のアイコン */}
                            <Box sx={{ flex: '0 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mr: 2 }}>
                                <IconButton onClick={toggleEditMode}>
                                    <AppRegistrationRoundedIcon sx={{ fontSize: 30 }} />
                                </IconButton>
                            </Box>

                            {/* 中央のタイトル */}
                            <Box sx={{ flex: '1 1 auto', textAlign: 'center', px: 2 }}>
                                <Typography variant="h6" gutterBottom fontWeight="normal" sx={{ color: "#5D4037", fontSize: { xs: '1.5rem', sm: '2.25rem' }, whiteSpace: 'nowrap', fontFamily: 'Times New Roman', }}>
                                    {editMode ? 'Edit Myclass' : 'MyClass'}
                                </Typography>
                            </Box>

                            {/* 右側の閉じるアイコン */}
                            <Box sx={{ flex: '0 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 2 }}>
                                <IconButton onClick={onClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>



                        <Grid container spacing={0.7} sx={{ mt: 0.1 }} alignItems="stretch">
                            <Grid item xs={1}>
                                <Box />
                            </Grid>
                            {weekdays.map((day) => (
                                <Grid item xs={2.2} key={day}>
                                    <Typography
                                        variant="subtitle2"
                                        align="center"
                                        fontWeight="bold"
                                        sx={{
                                            fontSize: {
                                                xs: '0.7rem',
                                                sm: '0.8rem',
                                                md: '0.9rem',
                                            },
                                        }}
                                    >
                                        {day}
                                    </Typography>
                                </Grid>
                            ))}

                            {periods.map((period) => (
                                <React.Fragment key={period}>
                                    <Grid item xs={1} sx={{ mb: 0.1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            align="center"
                                            fontWeight="bold"
                                            sx={{
                                                fontSize: {
                                                    xs: '0.7rem',
                                                    sm: '0.8rem',
                                                    md: '0.9rem',
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            {period}
                                        </Typography>
                                    </Grid>

                                    {weekdays.map((day) => (
                                        <Grid item xs={2.2} key={`${day}-${period}`} sx={{ display: 'flex', alignItems: 'stretch' }}>
                                            {renderClassForCell(day, period)}
                                        </Grid>
                                    ))}
                                </React.Fragment>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 1 }} />
                    </Box>

                    {editingClass && (
                        <Modal open={true} onClose={() => setEditingClass(null)}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: { xs: '90%', sm: '60%', md: '40%' },
                                    bgcolor: '#fff', // 柔らかい背景色
                                    borderRadius: 4, // 角をさらに丸く
                                    boxShadow: 24,
                                    p: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2, // アイテム間のスペース
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" component="h2" sx={{ color: '#EC407A' }}>
                                        授業を編集
                                    </Typography>
                                    <IconButton onClick={() => setEditingClass(null)} sx={{ color: '#EC407A' }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <TextField
                                    fullWidth
                                    label="授業"
                                    variant="outlined"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#B0B0B0', // 枠の色
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#EC407A',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#EC407A',
                                            },
                                        },

                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#EC407A', // フォーカス時のラベルの色を #EC407A に設定
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="教室"
                                    variant="outlined"
                                    value={classLocation}
                                    onChange={(e) => setClassLocation(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#B0B0B0', // 枠の色
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#EC407A',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#EC407A',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#EC407A', // フォーカス時のラベルの色を #EC407A に設定
                                        },
                                    }}
                                />
                                <Typography variant="subtitle1" sx={{ mt: 2, color: '#EC407A' }}>
                                    曜日
                                </Typography>
                                <ToggleButtonGroup
                                    // color="primary"
                                    value={classDay}
                                    exclusive
                                    onChange={(e, newDay) => {
                                        if (newDay !== null) {
                                            setClassDay(newDay);
                                        }
                                    }}
                                    fullWidth
                                    sx={{ '& .Mui-selected': { backgroundColor: '#EC407A !important', color: '#000' } }} // 選択時の色
                                >
                                    {weekdays.map((day) => (
                                        <ToggleButton value={day} key={day} sx={{ flexGrow: 1, borderRadius: 2 }}>
                                            {day}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>

                                <Typography variant="subtitle1" sx={{ mt: 2, color: '#EC407A' }}>
                                    時限
                                </Typography>
                                <ToggleButtonGroup
                                    // color="#000"
                                    value={classPeriod}
                                    exclusive
                                    onChange={(e, newPeriod) => {
                                        if (newPeriod !== null) {
                                            setClassPeriod(newPeriod);
                                        }
                                    }}
                                    fullWidth
                                    sx={{ '& .Mui-selected': { backgroundColor: '#EC407A !important', color: '#000' } }} // 選択時の色
                                >
                                    {periods.map((period) => (
                                        <ToggleButton value={period} key={period} sx={{ flexGrow: 1, borderRadius: 2 }}>
                                            {period}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={openConfirmModal}
                                        sx={{
                                            borderColor: '#EC407A',
                                            color: '#EC407A',
                                            '&:hover': {
                                                borderColor: '#D81B60',
                                                color: '#D81B60'
                                            }
                                        }}
                                    >
                                        時間割から取り消す
                                    </Button>

                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#EC407A', '&:hover': { backgroundColor: '#D81B60' } }}
                                        onClick={handleSaveChanges}
                                        disabled={!className || !classLocation} // 未入力の場合は保存ボタンを無効化
                                    >
                                        保存
                                    </Button>
                                </Box>
                                <Modal
                                    open={confirmModalOpen}
                                    onClose={closeConfirmModal}
                                    aria-labelledby="confirm-delete-title"
                                    aria-describedby="confirm-delete-description"
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: 300,
                                            bgcolor: 'background.paper',
                                            border: 'none',
                                            boxShadow: 24,
                                            p: 4,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography id="confirm-delete-title" variant="h6" component="h2" sx={{ color: '#EC407A' }}>
                                            確認
                                        </Typography>
                                        <Typography id="confirm-delete-description" sx={{ mt: 2 }}>
                                            本当にこの授業を時間割から取り消してもよろしいですか？
                                        </Typography>
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: '#EC407A', '&:hover': { backgroundColor: '#D81B60' } }}
                                                onClick={handleRemoveClass}
                                            >
                                                いいよ
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{ borderColor: '#EC407A', color: '#EC407A', '&:hover': { borderColor: '#D81B60', color: '#D81B60' } }}
                                                onClick={closeConfirmModal}
                                            >
                                                キャンセル
                                            </Button>
                                        </Box>
                                    </Box>
                                </Modal>

                            </Box>
                        </Modal>


                    )}
                </Box>
            </Fade>
        </Modal >
    );
};

export default MyClassModal;