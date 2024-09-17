'use client';
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Button, Box, Collapse } from '@mui/material';
import { firestore } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
    Assignment as AssignmentIcon,
    HistoryEdu as HistoryEduIcon,
    InsertDriveFile as InsertDriveFileIcon,
    Comment as CommentIcon,
    DateRange as DateRangeIcon,
    EventNote as EventNoteIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import { CardActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FileData {
    id: string;
    Title: string;
    comment?: string;
    createdAt: any;
    deadline?: string;
    share: string;
    url?: string;
    user: string;
    when?: string;
    whichtest?: string;
}



const getColor = (shareType: string) => {
    switch (shareType) {
        case 'report':
            return ' #90CAF9 '; // 課題・レポートの背景色（より落ち着いた青）
        case 'test':
            return '#F48FB1'; // 過去問の背景色（深いピンク）
        case 'other':
            return '#FFAB91'; // その他の背景色（オレンジ）
        default:
            return '#ECEFF1'; // デフォルトの背景色
    }
};

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

const getShareLabel = (shareType: string) => {
    switch (shareType) {
        case 'report':
            return '課題・レポート';
        case 'test':
            return '過去問';
        case 'other':
            return 'その他';
        default:
            return 'その他';
    }
};

const SharedFiles: React.FC<{ classId: string }> = ({ classId }) => {
    const [sharedFiles, setSharedFiles] = useState<FileData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedComment, setExpandedComment] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchSharedFiles = async () => {
            try {
                const docRef = doc(firestore, `class/class/${classId}/share`);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const files: FileData[] = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));

                    setSharedFiles(files);
                } else {
                    return null;
                }
            } catch (error) {
                // console.error("Error fetching shared files: ", error);
                setError('共有されたファイルの取得中にエラーが発生しました。');
            }
        };

        fetchSharedFiles();
    }, [classId]);

    const toggleComment = (id: string) => {
        setExpandedComment(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderFile = (file: FileData) => (
        <Grid item xs={4} sm={3} md={3} lg={2} xl={1.5} key={file.id} sx={{ display: 'flex', minWidth: 0 }}>
            <Paper
                sx={{
                    p: 1.1, // サイズを調整
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: getColor(file.share),
                    color: getTextColor(file.share),
                    transition: 'transform 0.2s',
                    borderRadius: 2,
                    boxShadow: 4,
                    '&:hover': {
                        transform: 'scale(1.02)', // ホバー時に少し拡大
                        boxShadow: 6,
                    },
                    mb: 2, // 間隔を詰める
                }}
            >
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.6rem', sm: '0.7rem', md: '1rem' } }} gutterBottom>{file.Title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 1, fontSize: { xs: '0.6rem', sm: '0.7rem', md: '1rem' } }}>{getShareLabel(file.share)}</Typography>
                    {file.deadline && (
                        <Box display="flex" alignItems="center" sx={{ mt: 0.2 }}>
                            <DateRangeIcon sx={{ mr: 0.5, opacity: 1, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.2rem' } }} />
                            <Typography variant="body2" sx={{ opacity: 1, fontSize: { xs: '0.6rem', sm: '0.7rem', md: '1.0rem' } }}> {file.deadline}</Typography>
                        </Box>
                    )}
                    {file.whichtest && (
                        <Box display="flex" alignItems="center" sx={{ mt: 0.2 }}>
                            <EventNoteIcon sx={{ mr: 0.5, opacity: 1, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.2rem' } }} />
                            <Typography variant="body2" sx={{ opacity: 1, fontSize: { xs: '0.6rem', sm: '0.7rem', md: '1.0rem' } }}>{file.when}{file.whichtest}</Typography>
                        </Box>
                    )}

                </Box>
                <Box mt={0.2} >
                    {file.url && (
                        <CardActions sx={{ justifyContent: 'center', mt: 0.1 }}>
                            <Button
                                variant="outlined"
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="medium"
                                sx={{
                                    fontSize: { xs: '0.6rem', sm: '0.8rem', md: '1.0rem' },
                                    color: 'white',
                                    border: '1px solid #fff',
                                    borderRadius: '15px',
                                    px: 2,
                                    backgroundColor: '',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        border: '#fff'
                                    },
                                }}
                            >
                                <Typography  sx={{ textTransform: 'none' }}>
                                    View
                                </Typography>

                            </Button>
                        </CardActions>

                    )}


                    {file.comment && (
                        <Box sx={{ mt: 0.1 }}>
                            <Button
                                variant="text"
                                sx={{

                                    color: '#FFFFFF',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                                    justifyContent: 'flex-start',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                                onClick={() => toggleComment(file.id)}
                            >
                                {expandedComment[file.id] ? (
                                    <CloseIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', md: '1.2rem' } }} />
                                ) : (
                                    <CommentIcon sx={{ mr: 0.5, fontSize: { xs: '1rem', md: '1.2rem' } }} />
                                )}
                            </Button>

                            <Collapse in={expandedComment[file.id]}>
                                <Box
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        backgroundColor: '#FFEBEE', // 柔らかいパステルピンク
                                        borderRadius: '12px', // 丸みを帯びた角
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // 軽い影を追加
                                        position: 'relative', // アイコンを配置するために必要
                                    }}
                                ><Typography
                                    variant="body2"
                                    sx={{
                                        color: '#5D4037', // 柔らかい茶色
                                        lineHeight: 1.6,
                                    }}
                                >
                                        {file.comment}
                                    </Typography>
                                </Box>
                            </Collapse>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Grid>
    );

    return (
        <Box sx={{ mt: 3, pb: 5 }}>
            {error && <Typography color="error" align="center">{error}</Typography>}
            {sharedFiles.length === 0 ? (
                <Typography variant="h6" align="center">
                    あなたの共有をお待ちしております。
                </Typography>
            ) : (
                <Grid container spacing={1.5} sx={{ maxWidth: '100%' }}>
                    {sharedFiles.map(renderFile)}
                </Grid>
            )}
        </Box>
    );
};

export default SharedFiles;
