import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, Fade } from '@mui/material';
import { firestore } from '../../../firebase'; // replace with your firebase config
import { doc, setDoc, getDoc } from 'firebase/firestore';
import ShareIcon from '@mui/icons-material/Share';
import { keyframes } from '@emotion/react';
import { useAuth } from '../Auth/AuthContext';
import { auth } from '../../../firebase';

// 花火のアニメーションを定義
const firework = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const stylegoogle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

const GoogleDriveInstructionsModal: React.FC = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button
                variant="text"
                onClick={handleOpen}
                sx={{ textTransform: 'none' }} // テキスト変換を無効化
            >
                GoogleDrive URLの作り方
            </Button>
            <Modal open={open} onClose={handleClose} closeAfterTransition>
                <Fade in={open}>
                    <Box sx={{ ...stylegoogle, width: 400 }}>
                        <Typography variant="h6" component="h2">Google Driveによる共有のやり方</Typography>
                        <Box mt={2}>
                            <Typography>1. Google Driveにファイルをアップロードします。</Typography>
                            <Typography>2. アップロードが完了したら、ファイルを右クリックし、「共有」を選択します。</Typography>
                            <Typography>3. 「リンクを取得」をクリックし、「リンクの共有をオンにする」を選択します。</Typography>
                            <Typography>4. 「リンクを知っている全員が閲覧可能」に設定します。</Typography>
                            <Typography>5. 表示されたリンクをコピーして、このフィールドに貼り付けます。</Typography>
                        </Box>
                        <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
                            閉じる
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};



// 型定義
interface ClassData {
    Title: string;
    comment: string;
    user: any;
    share: string;
    deadline: string;
    whichtest: string;
    when: string;
    url: string;
    createdAt: Date;
    cN?: string; // cNを追加
    path: string;
}

// コンポーネントの定義
const FileUploadModal: React.FC<{ classId: string, userId: string }> = ({ classId, userId }) => {
    const [open, setOpen] = useState(false);
    const [thankYouOpen, setThankYouOpen] = useState(false);
    const [fileURL, setFileURL] = useState<string>('');
    const [purpose, setPurpose] = useState('');
    const [deadline, setDeadline] = useState('');
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [testType, setTestType] = useState('');
    const [year, setYear] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleThankYouOpen = () => setThankYouOpen(true);
    const handleThankYouClose = () => setThankYouOpen(false);

    const handleURLValidation = (url: string) => {
        const regex = /^https:\/\/drive\.google\.com/;
        return regex.test(url);
    };

    function generateShortUUID() {
        return Math.random().toString(36).slice(2, 7).toUpperCase();
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleShare = async () => {
        if (!currentUser) {
            alert('ユーザーがログインしていません。');
            return;
        }

        if (!title) {
            alert('タイトルは必須です。');
            return;
        }

        if (!handleURLValidation(fileURL)) {
            alert('無効なGoogleドライブのURLです。');
            return;
        }

        const shortUUID = generateShortUUID();
        const fileName = `${classId}_${purpose}_${shortUUID}`;
        const path = `class/class/${classId}/share/`; // pathの生成

        let updatedClassData: ClassData = {
            Title: title,
            comment,
            user: currentUser.uid,
            share: purpose,
            deadline: purpose === 'report' ? deadline : '',
            whichtest: purpose === 'test' ? testType : '',
            when: purpose === 'test' && testType !== '小テスト' ? year : '',
            url: fileURL,
            createdAt: new Date(),
            path, // 生成したpathをclassDataに追加
        };

        try {
            // `detail` ドキュメントから `cN` の値を取得
            const classcNDocRef = doc(firestore, `class/class/${classId}/detail`);
            const classcNDocSnap = await getDoc(classcNDocRef);

            if (classcNDocSnap.exists()) {
                const classcNData = classcNDocSnap.data();
                const cNValue = classcNData?.cN || ''; // cNが存在しない場合は空文字列
                updatedClassData = {
                    ...updatedClassData,  // 既存のclassDataのプロパティを保持
                    cN: cNValue,          // 新しくcNValueを追加
                };
            }

            // Classコレクションに保存
            await setDoc(doc(firestore, `class/class/${classId}/share`), {
                [fileName]: updatedClassData, // fileName をキーとして保存
            }, { merge: true });

            // Userコレクションに保存
            await setDoc(doc(firestore, `users/users/${currentUser.email}/share`), {
                [fileName]: {
                    path,
                    classData: updatedClassData, // 修正後のデータを保存
                },
            }, { merge: true });

            handleClose();
            handleThankYouOpen();

            // フィールドのリセット
            setFileURL('');
            setPurpose('');
            setDeadline('');
            setTitle('');
            setComment('');
            setTestType('');
            setYear('');

            // 3秒後にページリロード
            setTimeout(() => {
                handleThankYouClose();
                window.location.reload();
            }, 3000);
        } catch (error) {
            // console.error('Error adding document: ', error);
            alert('共有に失敗しました。もう一度お試しください。');
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    startIcon={<ShareIcon />}
                    sx={{
                        backgroundColor: '#2196f3',
                        color: '#fff',
                        textTransform: 'none',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#1976d2',
                            boxShadow: '0 6px 25px rgba(33, 150, 243, 0.5)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(1px)',
                        },
                        '& .MuiButton-startIcon': {
                            marginRight: '10px',
                            transition: 'transform 0.3s ease',
                        },
                        '&:hover .MuiButton-startIcon': {
                            transform: 'rotate(15deg)',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                            transform: 'rotate(45deg)',
                            animation: 'shimmer 3s linear infinite',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'rotate(45deg)',
                            transition: 'all 0.3s ease',
                        },
                        '&:hover::after': {
                            top: '-100%',
                            left: '-100%',
                        },
                        '@keyframes shimmer': {
                            '0%': { transform: 'translateX(-100%) rotate(45deg)' },
                            '100%': { transform: 'translateX(100%) rotate(45deg)' },
                        },
                    }}
                >
                    共有
                </Button>
            </Box>

            <Modal open={open} onClose={handleClose} closeAfterTransition>
                <Fade in={open}>
                    <Box sx={{ ...style, width: 400, p: 3, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>共有する</Typography>
                        <TextField
                            label="GoogleDrive URL を入力"
                            fullWidth
                            value={fileURL}
                            onChange={(e) => setFileURL(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <GoogleDriveInstructionsModal />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="purpose-label">何を共有しますか？</InputLabel>
                            <Select
                                labelId="purpose-label"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                label="目的"
                            >
                                <MenuItem value="report">レポート・課題</MenuItem>
                                <MenuItem value="test">過去問</MenuItem>
                                <MenuItem value="other">その他</MenuItem>
                            </Select>
                        </FormControl>
                        {purpose === 'report' && (
                            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                                <>
                                    <TextField
                                        label="提出期限"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={(e) => setDeadline('')}
                                        sx={{ mt: 1 }}
                                    >
                                        期限なしにする
                                    </Button>
                                </>
                            </FormControl>
                        )}
                        {purpose === 'test' && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="test-type-label">テストの種類</InputLabel>
                                <Select
                                    labelId="test-type-label"
                                    value={testType}
                                    onChange={(e) => setTestType(e.target.value)}
                                    label="テストの種類"
                                >
                                    <MenuItem value="中間テスト">中間テスト</MenuItem>
                                    <MenuItem value="期末テスト">期末テスト</MenuItem>
                                    <MenuItem value="小テスト">小テスト</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        {purpose === 'test' && testType && testType !== '小テスト' && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="year-label">年度</InputLabel>
                                <Select
                                    labelId="year-label"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    label="年度"
                                >
                                    <MenuItem value="">不明です</MenuItem>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <TextField
                            label="タイトル"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="コメント"
                            fullWidth
                            multiline
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<ShareIcon />}
                                sx={{
                                    mt: 2,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    background: 'none',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: !title || !handleURLValidation(fileURL)
                                            ? 'gray'
                                            : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                        zIndex: -1,
                                        transition: 'opacity 1.2s',
                                        opacity: !title || !handleURLValidation(fileURL) ? 0 : 1,
                                    },
                                    '&:hover::before': {
                                        opacity: !title || !handleURLValidation(fileURL) ? 1 : 1,
                                    },
                                    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: !title || !handleURLValidation(fileURL) ? 'none' : 'scale(1.1)',
                                    },
                                }}
                                onClick={handleShare}
                                disabled={!title || !handleURLValidation(fileURL)}
                            >
                                共有する
                            </Button>


                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Thank You Modal */}
            <Modal open={thankYouOpen} onClose={handleThankYouClose} closeAfterTransition>
                <Fade in={thankYouOpen} timeout={{ enter: 1000, exit: 2000 }}>
                    <Box sx={{
                        ...style,
                        width: 400,
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #FFD700 30%, #FF8C00 90%)',
                        color: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        overflow: 'hidden'
                    }}>

                        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>共有していただきありがとうございます。</Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            ご協力心より感謝いたします。
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleThankYouClose}
                            sx={{
                                mt: 2,
                                bgcolor: '#fff',
                                color: '#FF8C00',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s, color 0.3s, transform 0.3s',
                                '&:hover': {
                                    bgcolor: '#FF8C00',
                                    color: '#fff',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            閉じる
                        </Button>

                        <Box sx={{
                            position: 'absolute',
                            top: '10%',
                            left: '10%',
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            animation: `${firework} 2s infinite`
                        }} />
                        <Box sx={{
                            position: 'absolute',
                            top: '20%',
                            right: '15%',
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            animation: `${firework} 2s infinite 0.5s`
                        }} />
                        <Box sx={{
                            position: 'absolute',
                            bottom: '15%',
                            left: '20%',
                            width: '25px',
                            height: '25px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            animation: `${firework} 2s infinite 1s`
                        }} />
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};

export default FileUploadModal;
