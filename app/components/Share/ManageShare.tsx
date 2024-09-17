'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '@/firebase';
import { IconButton, Button, Grid, Paper, Typography, Box, Collapse, CardActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Loading from '../Element/Loading';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningIcon from '@mui/icons-material/Warning';
import { Autocomplete } from '@mui/material';
import AppBar2 from '../AppBar/AppBar2';
import Fade from '@mui/material/Fade';


// 型定義
interface ClassData {
    Title: string;
    comment: string;
    createdAt: any;
    deadline: string;
    share: string;
    url: string;
    user: string;
    when: string;
    whichtest: string;
    cN: string;
    path: string;
}

interface ClassDocument {
    classData: ClassData;
    path: string;
}

interface ShareDocument {
    [classId: string]: ClassDocument;
}

// Firestoreからデータを取得する非同期関数
const fetchFirestoreData = async (email: string | null) => {
    if (!email) return null;

    try {
        const docRef = doc(firestore, `users/users/${email}/share`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log('Fetched data:', docSnap.data());
            return docSnap.data() as ShareDocument;
        } else {
            // console.log('No such document!');
            return null;
        }
    } catch (error) {
        // console.error('Error fetching document:', error);
        return null; // エラーが発生した場合にも null を返す
    }
};
// Firestoreからデータを削除する関数
const deleteFirestoreData = async (fileName: string, classData: ClassData, currentUser: any) => {
    const classDocRef = doc(firestore, classData.path); // 読み込んだpathを使用
    const userDocRef = doc(firestore, `users/users/${currentUser.email}/share`);

    try {
        // クラスコレクションから削除
        await updateDoc(classDocRef, {
            [fileName]: deleteField(),
        });

        // ユーザーコレクションから削除
        await updateDoc(userDocRef, {
            [fileName]: deleteField(),
        });

        // console.log(`Document ${fileName} successfully deleted!`);
    } catch (error) {
        // console.error("Error deleting document: ", error);
    }
};

// 色を取得する関数
const getColor = (shareType: string) => {
    switch (shareType) {
        case 'report':
            return '#90CAF9'; // 課題・レポートの背景色
        case 'test':
            return '#F48FB1'; // 過去問の背景色
        case 'other':
            return '#FFAB91'; // その他の背景色
        default:
            return '#ECEFF1'; // デフォルトの背景色
    }
};

// テキスト色を取得する関数
const getTextColor = (shareType: string) => {
    switch (shareType) {
        case 'report':
            return '#FFFFFF'; // 課題・レポートのテキスト色
        case 'test':
            return '#FFFFFF'; // 過去問のテキスト色
        case 'other':
            return '#FFFFFF'; // その他のテキスト色
        default:
            return '#000000'; // デフォルトのテキスト色
    }
};

// ランダムなフレーズを取得する関数
const phrases = [
    "本当にいいの？",
    "まだ間に合うよ",
    "後悔しない？",
    "これでいいんですね？",
    "本当にこれでいいの？",
    "最後のチャンスだよ？",
    "取り返しがつかないけどいいの？",
    "本当に削除してもいいの？",
    "これで全部失うけど本当に？",
    "後戻りはできないよ",
    "もう元には戻せない、、",
    "今が引き返す最後のタイミングだ",
    "この操作はもう取り消せないよ？",
    "本当にいいんだね？",
    "消しちゃったら終わりだけど、いいの？",
    "失ったものは戻らない",
];

const getRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
};

// データ表示コンポーネント
const ShareList = ({ email }: { email: string | null }) => {
    const [data, setData] = useState<ShareDocument | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [expandedComment, setExpandedComment] = useState<{ [key: string]: boolean }>({});
    const [open, setOpen] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [selectedClassData, setSelectedClassData] = useState<ClassData | null>(null);
    const [randomPhrase, setRandomPhrase] = useState(getRandomPhrase());
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCN, setFilterCN] = useState<string>('');
    const [noDataMessage, setNoDataMessage] = useState<string | null>('まだ共有されていません');
    const [sortOrder, setSortOrder] = useState<string>('newest');
    const [rotating, setRotating] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        // コンポーネントがマウントされたときにフェードインを開始
        // console.log('Email:', email);  // 追加
        setFadeIn(true);
    }, []);

    // 初回ロード時にFirestoreからデータを取得し、ローカルストレージに保存
    useEffect(() => {
        const fetchData = async () => {
            if (email) {
                const storedData = localStorage.getItem('shareData');
                if (storedData) {
                    setData(JSON.parse(storedData));
                    setNoDataMessage(null);
                } else {
                    const fetchedData = await fetchFirestoreData(email);
                    if (fetchedData) {
                        setData(fetchedData);
                        localStorage.setItem('shareData', JSON.stringify(fetchedData));
                        setNoDataMessage(null);
                    } else {
                        setData(null);
                        setNoDataMessage('共有データがありません。');
                    }
                }
            }
        };
        fetchData();
    }, [email]);

    const courseNames = data ? Array.from(new Set(Object.values(data).map(doc => doc.classData.cN))) : [];



    // 再読み込みボタンでFirestoreからデータを再取得
    const handleRefresh = async () => {
        if (email) {
            const fetchedData = await fetchFirestoreData(email);
            if (fetchedData) {
                setData(fetchedData);
                localStorage.setItem('shareData', JSON.stringify(fetchedData));
                setNoDataMessage(null);
            } else {
                setData(null); 
                setNoDataMessage('共有データがありません。');
            }
        }
    };

    const handleClickOpen = (fileName: string, classData: ClassData) => {
        setSelectedFileName(fileName);
        setSelectedClassData(classData);
        setRandomPhrase(getRandomPhrase());
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFileName(null);
        setSelectedClassData(null);
    };

    const handleConfirmDelete = () => {
        if (selectedFileName && selectedClassData && currentUser) {
            deleteFirestoreData(selectedFileName, selectedClassData, currentUser);
            handleClose();
        }
    };
    const handleClick = () => {
        setRotating(true); // 回転を開始
        handleRefresh(); // データの更新処理
        setTimeout(() => setRotating(false), 2000); // 回転アニメーションが完了する時間に合わせてリセット
    };


    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // if (!email) {
    //     return <>Emailが存在しません</>
    // }

    // if (data === null) {
    //     return (
    //         <Box sx={{ textAlign: 'center', mt: 3 }}>
    //             <Typography variant="body2" color="textSecondary">
    //                 {noDataMessage}
    //             </Typography>
    //         </Box>
    //     );
    // }
    const toggleComment = (id: string) => {
        setExpandedComment(prev => ({ ...prev, [id]: !prev[id] }));
    };



    const filteredData = data ? Object.entries(data)
    .filter(([classId, classDoc]) => {
        const matchesType = filterType === 'all' || classDoc.classData.share === filterType;
        const matchesCN = classDoc.classData.cN.toLowerCase().includes(filterCN.toLowerCase());
        return matchesType && matchesCN;
    })
    .sort(([idA, docA], [idB, docB]) => {
        if (sortOrder === 'newest') {
            return docB.classData.createdAt.seconds - docA.classData.createdAt.seconds; // 降順でソート
        } else if (sortOrder === 'oldest') {
            return docA.classData.createdAt.seconds - docB.classData.createdAt.seconds; // 昇順でソート
        }
        return 0; // ソートなし
    })
    : []; // data が null の場合は空の配列を返す



    return (
        <>
            <Box
                sx={{
                    opacity: fadeIn ? 1 : 0,  // フェードインのアニメーション
                    transition: 'opacity 2s ease-in-out',  // 1秒間のフェードインアニメーション
                }}
            >

                <AppBar2>
                    <Box
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"

                        mb={3}
                        sx={{
                            borderRadius: '0px', // 全体のborder-radiusをリセット
                            background: 'linear-gradient(20deg, #303F9F 1%, #039BE5 90%)', // 背景色を指定
                            // background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)', // 背景色を指定
                            borderBottomLeftRadius: '15px', // 左下の角を2pxの角丸にする
                            borderBottomRightRadius: '15px', // 右下の角を2pxの角丸にする
                            p: 0.5                   // 内側の余白を追加
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                color: '#fff',       // テキストの色を白に変更
                                fontFamily: 'Times New Roman, Times, serif',  // フォントを Times New Roman に設定
                            }}
                        >
                            ManageShare
                        </Typography>

                        <IconButton
                            onClick={handleClick}
                            sx={{
                                bgcolor: '#fff',
                                '&:hover': {
                                    bgcolor: '#E1F5FE',
                                    transform: 'scale(1.2),rotate(45deg)',


                                },
                                borderRadius: '50%',
                                p: 1,
                                transition: 'transform 2s ease', // スムーズな変化
                                transform: rotating ? 'rotate(1080deg)' : 'rotate(0deg)', // クリック時の回転
                            }}
                        >
                            <RefreshIcon sx={{ color: '#90CAF9' }} />
                        </IconButton>

                    </Box>

                    <Box display="flex" gap={0.5} mb={1}>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="filter-type-label">Type</InputLabel>
                            <Select
                                labelId="filter-type-label"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                label="Type"
                                sx={{
                                    minWidth: '70px',
                                    width: '12vw',
                                    minHeight: '4.5vh',
                                    height: '4.7',  // フィールドの幅を固定
                                    fontSize: {
                                        xs: '0.5rem',   // 小さなデバイス (例: スマートフォン)
                                        sm: '0.5rem',   // 中程度のデバイス (例: タブレット)
                                        md: '0.9rem',     // 大きなデバイス (例: 小型ラップトップ)
                                        lg: '1.1rem',   // 非常に大きなデバイス (例: デスクトップ)
                                    },
                                    whiteSpace: 'nowrap',      // テキストを1行に制限
                                    overflow: 'hidden',        // はみ出た部分を隠す
                                    textOverflow: 'clip',      // 文字がはみ出た部分を切り取る
                                }}
                            >
                                <MenuItem value="all">すべて</MenuItem>
                                <MenuItem value="report">レポート・課題</MenuItem>
                                <MenuItem value="test">過去問</MenuItem>
                                <MenuItem value="other">その他</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" size="small">
                            <InputLabel id="sort-order-label" sx={{
                                fontSize: {
                                    xs: '0.7rem',   // 小さなデバイス (例: スマートフォン)
                                    sm: '0.8rem',   // 中程度のデバイス (例: タブレット)
                                    md: '0.8rem',     // 大きなデバイス (例: 小型ラップトップ)
                                    lg: '1.1rem',   // 非常に大きなデバイス (例: デスクトップ)
                                },
                            }}>登録日</InputLabel>
                            <Select
                                labelId="sort-order-label"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                label="Order"
                                sx={{
                                    minWidth: '80px',
                                    width: '12vw',
                                    minHeight: '4.5vh',
                                    height: '4.7',  // フィールドの幅を固定
                                    fontSize: {
                                        xs: '0.5rem',   // 小さなデバイス (例: スマートフォン)
                                        sm: '0.5rem',   // 中程度のデバイス (例: タブレット)
                                        md: '0.9rem',     // 大きなデバイス (例: 小型ラップトップ)
                                        lg: '1.1rem',   // 非常に大きなデバイス (例: デスクトップ)
                                    },
                                    whiteSpace: 'nowrap',      // テキストを1行に制限
                                    overflow: 'hidden',        // はみ出た部分を隠す
                                    textOverflow: 'clip',      // 文字がはみ出た部分を切り取る
                                }}
                            >
                                <MenuItem value="newest">新しい順</MenuItem>
                                <MenuItem value="oldest">古い順</MenuItem>
                            </Select>
                        </FormControl>

                        <Autocomplete
                            freeSolo
                            options={courseNames}  // 提案として表示する授業名リスト
                            value={filterCN}
                            onChange={(event, newValue) => setFilterCN(newValue || '')}  // 選択された値の処理
                            onInputChange={(event, newInputValue) => setFilterCN(newInputValue)}  // テキストが入力されたときの処理
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    size="small"
                                    label="Course Name"
                                />
                            )}
                            sx={{
                                minHeight: '4.5vh',
                                maxWidth: '500px',
                                minWidth: '200px',
                                width: '55vw',
                            }}
                            ListboxProps={{
                                sx: {
                                    '& .MuiAutocomplete-option': {
                                        // デフォルトのフォントサイズ
                                        fontSize: '1rem',
                                    },
                                    '& .MuiAutocomplete-option:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',  // ホバー時に薄いグレー
                                    },
                                    // デバイスによるフォントサイズの調整
                                    '@media (max-width: 600px)': {
                                        '& .MuiAutocomplete-option': {
                                            fontSize: '0.7rem',  // スマホや小さいデバイス用
                                        },
                                    },
                                    '@media (min-width: 600px) and (max-width: 960px)': {
                                        '& .MuiAutocomplete-option': {
                                            fontSize: '0.8rem',  // タブレットや中くらいのデバイス用
                                        },
                                    },
                                    '@media (min-width: 960px)': {
                                        '& .MuiAutocomplete-option': {
                                            fontSize: '0.9rem',  // 大きいデバイスやPC用
                                        },
                                    },
                                },
                            }}
                        />

                    </Box>
                    {data === null || filteredData.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                            共有データがありません。
                        </Typography>
                    </Box>
                ) :(



                    <Grid container spacing={0.7}>
                        {filteredData.map(([classId, classDoc]) => (
                            <Grid item xs={4} sm={4} md={3} lg={2} xl={1.5} key={classId}>
                                <Paper
                                    sx={{
                                        padding: 1,
                                        backgroundColor: getColor(classDoc.classData.share),
                                        color: getTextColor(classDoc.classData.share),
                                        transition: 'transform 0.2s',
                                        borderRadius: 2,
                                        boxShadow: 0,
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 0,
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: {
                                                xs: '0.6rem',
                                                sm: '0.8rem',
                                                md: '1rem',
                                                lg: '1rem',
                                                xl: '1.0rem'
                                            },
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {classDoc.classData.cN}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: {
                                                xs: '0.7rem',
                                                sm: '0.8rem',
                                                md: '1rem',
                                                lg: '1rem',
                                                xl: '1.0rem'
                                            },
                                            fontWeight: 'normal',
                                            marginBottom: 1
                                        }}
                                    >
                                        ・{classDoc.classData.Title}
                                    </Typography>
                                    <Box sx={{ textAlign: 'right' }}>
                                        {classDoc.classData.deadline && (
                                            <Box sx={{ mt: -0.5, mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 1, fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' }, textAlign: 'right' }}>
                                                    期限: {classDoc.classData.deadline}
                                                </Typography>
                                            </Box>
                                        )}
                                        {classDoc.classData.whichtest && (
                                            <Box sx={{ mt: -0.5, mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 1, fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' }, textAlign: 'right' }}>
                                                    {classDoc.classData.when}{classDoc.classData.whichtest}
                                                </Typography>
                                            </Box>
                                        )}
                                        {classDoc.classData.share === 'other' && classDoc.classData.deadline === "" && (
                                            <Box sx={{ mt: -0.5, mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ opacity: 0, fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' }, textAlign: 'right' }}>
                                                    見せられないよ
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <CardActions sx={{ justifyContent: 'center', mt: -1 }}>
                                        <Button
                                            variant="outlined"
                                            href={classDoc.classData.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="medium"
                                            sx={{
                                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1.0rem' },
                                                color: 'white',
                                                border: '1px solid #fff',
                                                borderRadius: '15px',
                                                px: 4,
                                                py: 0.8,
                                                backgroundColor: '', // デフォルトの背景色は設定しない
                                                display: 'flex',
                                                alignItems: 'center',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // ホバー時の背景色を設定
                                                    borderColor: '#fff' // ホバー時のボーダー色を設定
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: 'inherit',
                                                    color: 'inherit',
                                                    margin: -0.1,
                                                    padding: 0,
                                                }}
                                            >
                                                Check
                                            </Typography>
                                        </Button>

                                    </CardActions>

                                    <Box mt={-1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Button
                                            variant="text"
                                            sx={{
                                                color: getTextColor(classDoc.classData.share),
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '0.875rem',
                                                justifyContent: 'flex-start',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                }
                                            }}
                                            onClick={() => toggleComment(classId)}
                                        >
                                            {expandedComment[classId] ? (
                                                <CloseIcon sx={{ fontSize: '1rem' }} />
                                            ) : (
                                                <CommentIcon sx={{ fontSize: '1rem' }} />
                                            )}
                                        </Button>
                                        <IconButton
                                            onClick={() => handleClickOpen(classId, classDoc.classData)}
                                            sx={{ fontSize: '0.5rem', color: "#78909C" }}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Box>

                                    {classDoc.classData.comment && (
                                        <Box sx={{ mt: 0 }}>
                                            <Collapse in={expandedComment[classId]}>
                                                <Box
                                                    sx={{
                                                        mt: 0,
                                                        p: 0.7,
                                                        backgroundColor: '#FFF',
                                                        opacity: 0.8,
                                                        borderRadius: 2,
                                                        boxShadow: 0,
                                                        color: '#5D4037',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: {
                                                                xs: '0.6rem',
                                                                sm: '0.8rem',
                                                                md: '0.8rem',
                                                                lg: '0.7rem',
                                                                xl: '0.8rem'
                                                            }
                                                        }}
                                                    >
                                                        {classDoc.classData.comment}
                                                    </Typography>
                                                </Box>
                                            </Collapse>

                                            <Typography variant="body2" sx={{
                                                mt: 0,
                                                textAlign: 'right',
                                                fontSize: {
                                                    xs: '0.6rem',
                                                    sm: '0.8rem',
                                                    md: '0.9rem',
                                                    lg: '0.8rem',
                                                    xl: '0.8rem'
                                                }
                                            }}>
                                                登録日: {new Date(classDoc.classData.createdAt.seconds * 1000).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                            <WarningIcon sx={{ mr: 1 }} />
                            {randomPhrase}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                この操作は取り消せません。削除されたデータは元に戻せません。
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
                                キャンセル
                            </Button>
                            <Button onClick={handleConfirmDelete} sx={{ color: 'error.main', fontWeight: 'bold' }} autoFocus>
                                本当に削除する
                            </Button>
                        </DialogActions>
                    </Dialog>

                </AppBar2>
            </Box>
        </>
    );
};

// ページコンポーネント
const HomePage = () => {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
            } else {
                setEmail(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <ShareList email={email} />
        </div>
    );
};

export default HomePage;
