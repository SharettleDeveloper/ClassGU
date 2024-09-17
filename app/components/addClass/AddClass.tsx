'use client';
import { useState } from 'react';
import { Container, Typography, Paper, Button, Grid, Fade, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { firestore } from '../../../firebase';
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import AppBar2 from '../../components/AppBar/AppBar2';
import FormInput from '../../components/addClass/FormInput';
import CourseDetails from '../../components/addClass/CourseDetails';
import Alerts from '../../components/addClass/Alerts';
import { CourseData } from '../../components/addClass/types'; // types.tsファイルを作成
import SaveIcon from '@mui/icons-material/Save';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';




interface AddClassModalProps {
    open: boolean;
    onClose: () => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({ open, onClose }) => {
    const [courseId, setCourseId] = useState('');
    const [data, setData] = useState<CourseData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const router = useRouter();

    // handleSubmit, handleSave, handleUpdate, handleCancel関数をここに定義
    const currentYear = new Date().getFullYear();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedCourseId = courseId.trim().replace(/\s+/g, '');

        const url = `https://alss-portal.gifu-u.ac.jp/campusweb/slbssbdr.do?risyunen=${currentYear}&semekikn=1&kougicd=${trimmedCourseId}`;

        try {
            const response = await fetch('https://classgu.sharettle.com/API/sirabasuget.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (response.ok) {
                const result: CourseData = await response.json();
                const parsedResult = parseSchedule(result.sched);
                setData({ ...result, ...parsedResult });
                setError(null);
            } else {
                // console.error('Failed to fetch course data');
                setError('講義情報の取得に失敗しました');
            }
        } catch (error) {
            // console.error('Error fetching course data:', error);
            setError('講義情報の取得中にエラーが発生しました。');
        }
    };

    const handleSave = async () => {
        if (data) {
            const trimmedCourseId = courseId.trim().replace(/\s+/g, '');
            const classDocRef = doc(firestore, `class/class/${trimmedCourseId}/detail`);

            try {
                const classDocSnap = await getDoc(classDocRef);

                if (classDocSnap.exists()) {
                    const existingData = classDocSnap.data();
                    if (existingData) {
                        const previousCreatedAt = existingData.cAt?.toDate();
                        if (previousCreatedAt) {
                            const warningMessage = `この講義は既に登録されています。以前の作成日は ${previousCreatedAt.toLocaleDateString()} です。更新しますか？`;
                            setIsUpdate(true);
                            setError(warningMessage);
                            return;
                        }
                    }
                }

                const trimmedData = {
                    ...data,
                    cN: data.cN.trim(),
                    cNE: data.cNE?.trim() || '',  // undefinedの場合は空文字列に
                    ins: data.ins.trim(),
                    dpt: data.dpt.trim(),
                    sCat: data.sCat.trim(),
                    sCls: data.sCls?.trim() || '',  // undefinedの場合は空文字列に
                    tYr: data.tYr.trim().replace('年生', '').replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)), // 全角数字を半角に変換
                    sched: data.sched.trim(),
                    fmt: data.fmt.trim(),
                    rCode: data.rCode.trim(),
                    crd: data.crd.trim(),
                    note: data.note.trim(),
                    sUrl: data.sUrl.trim(),
                    trm: data.trm?.trim().replace('学期', '') || '',  // undefinedの場合は空文字列に
                    dWk: data.dWk?.trim().replace('曜日', '') || '',  // undefinedの場合は空文字列に
                    prd: data.prd?.trim().replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)) || '',  // undefinedの場合は空文字列に
                    loc: data.loc?.trim() || '',  // undefinedの場合は空文字列に
                    cAt: Timestamp.fromDate(new Date()),
                };

                await setDoc(classDocRef, trimmedData);

                await setDoc(doc(firestore, 'class/classmanage'), {
                    [trimmedData.rCode]: {
                        cN: trimmedData.cN,
                        ins: trimmedData.ins,
                        dpt: trimmedData.dpt,
                        sCat: trimmedData.sCat,
                        sCls: trimmedData.sCls,
                        tYr: parseInt(trimmedData.tYr, 10), // 学年を数字として保存
                        crd: parseFloat(trimmedData.crd),
                        trm: trimmedData.trm,
                        dWk: trimmedData.dWk,
                        prd: parseInt(trimmedData.prd, 10), // prdを数字として保存
                        cAt: trimmedData.cAt,
                    },
                }, { merge: true });

                setSuccess('授業情報が新しく登録されました！');
                setError(null);
                setTimeout(() => {
                    handleCancel();
                    onClose();
                },1000);
                

            } catch (error) {
                // console.error('Error adding document:', error);
                setError('授業の登録中にエラーが発生しました。');
                setSuccess(null);
            }
        }
    };

    const handleUpdate = async () => {
        if (data) {
            const trimmedCourseId = courseId.trim().replace(/\s+/g, '');

            try {
                const trimmedData = {
                    ...data,
                    cN: data.cN.trim(),
                    cNE: data.cNE?.trim() || '',  // undefinedの場合は空文字列に
                    ins: data.ins.trim(),
                    dpt: data.dpt.trim(),
                    sCat: data.sCat.trim(),
                    sCls: data.sCls?.trim() || '',  // undefinedの場合は空文字列に
                    tYr: data.tYr.trim().replace('年生', '').replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)), // 全角数字を半角に変換
                    sched: data.sched.trim(),
                    fmt: data.fmt.trim(),
                    rCode: data.rCode.trim(),
                    crd: data.crd.trim(),
                    note: data.note.trim(),
                    sUrl: data.sUrl.trim(),
                    trm: data.trm?.trim().replace('学期', '') || '',  // undefinedの場合は空文字列に
                    dWk: data.dWk?.trim().replace('曜日', '') || '',  // undefinedの場合は空文字列に
                    prd: data.prd?.trim().replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)) || '',  // undefinedの場合は空文字列に
                    loc: data.loc?.trim() || '',  // undefinedの場合は空文字列に
                    cAt: Timestamp.fromDate(new Date()),
                };

                await setDoc(doc(firestore, `class/class/${trimmedCourseId}/detail`), {
                    ...trimmedData,
                    cAt: Timestamp.fromDate(new Date()),
                });

                await setDoc(doc(firestore, 'class/classmanage'), {
                    [trimmedData.rCode]: {
                        cN: trimmedData.cN,
                        ins: trimmedData.ins,
                        dpt: trimmedData.dpt,
                        sCat: trimmedData.sCat,
                        sCls: trimmedData.sCls,
                        tYr: parseInt(trimmedData.tYr, 10), // 学年を数字として保存
                        crd: parseFloat(trimmedData.crd),
                        trm: trimmedData.trm,
                        dWk: trimmedData.dWk,
                        prd: parseInt(trimmedData.prd, 10), // prdを数字として保存
                        cAt: Timestamp.fromDate(new Date()),
                    },
                }, { merge: true });

                setSuccess('授業情報が更新されました！');
                setError(null);
                setTimeout(() => {
                    handleCancel();
                    onClose();
                },1000);

            } catch (error) {
                // console.error('Error updating document:', error);
                setError('授業の更新中にエラーが発生しました。');
                setSuccess(null);
            }
        }
    };


    const handleCancel = () => {
        setData(null);
        setCourseId('');
        setError(null);
        setSuccess(null);
        setIsUpdate(false);
    };

    const parseSchedule = (schedule: string) => {
        const termMatch = schedule.match(/(前学期|後学期)/);
        const dayMatch = schedule.match(/(月曜日|火曜日|水曜日|木曜日|金曜日)/);
        const periodMatch = schedule.match(/([１-５])時限/);
        const locationMatch = schedule.match(/(?:月曜日|火曜日|水曜日|木曜日|金曜日)\s[１-５]時限\s(.+)/);

        return {
            trm: termMatch ? termMatch[0] : '',
            dWk: dayMatch ? dayMatch[0] : '',
            prd: periodMatch ? periodMatch[1].replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)) : '',
            loc: locationMatch ? locationMatch[1] : ''
        };
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    overflowY: 'auto',
                    maxHeight: '100vh',
                    width: '90%',
                    maxWidth: 900,
                    margin: 'auto',
                    boxShadow: 2,
                    color: '#37474f',
                    outline: 'none', // これを追加してフォーカスリングを無効化
                    position: 'relative',
                    '&::-webkit-scrollbar': {
                        display: 'none', // Webkitベースのブラウザでスクロールバーを非表示
                    },
                    '-ms-overflow-style': 'none', // Internet Explorer用にスクロールバーを非表示
                    'scrollbar-width': 'none', // Firefox用にスクロールバーを非表示

                }}>

                    <Container maxWidth="md" sx={{
                        mt: { xs: 2, sm: 3, md: 4 },
                        mb: { xs: 2, sm: 3, md: 4 },
                        // background: 'linear-gradient(0deg, #81D4FA 0%, #2575fc 100%)', // はっきりした色合いのグラデーションを適用
                        background: '#FFCC80', // はっきりした色合いのグラデーションを適用
                        borderRadius: '16px',
                        padding: { xs: '15px', sm: '20px', md: '30px' },
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: 50,  // 上からの距離を指定
                                right: 30, // 右からの距離を指定
                                color: '#37474f',
                                zIndex: 0,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h4" gutterBottom sx={{
                            color: '#fff', // 白でタイトルを設定
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                            mb: 2,
                        }}>
                            授業を追加
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{
                            color: '#ffffff', // 白でサブタイトルを設定
                            textAlign: 'center',
                            mb: { xs: 2, sm: 3, md: 4 },
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        }}>
                            <h4>検索したのにお探しの授業が見つからなかった方へ</h4>
                            <p>こちらから授業を追加してみましょう</p>
                            <p>

                                <strong>やりかた：</strong>シラバスから登録したい講義を探して、履修コードを入力します。「講義情報を取得する」を押したら、最後に登録ボタンで登録完了です。
                            </p>
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => window.open('https://alss-portal.gifu-u.ac.jp/campusweb/slbsskwr.do?clearAccessData=true&contenam=slbsskwr&kjnmnNo=77', '_blank')}
                            sx={{
                                mb: { xs: 2, sm: 3, md: 4 },
                                display: 'block',
                                mx: 'auto',
                                padding: '12px 24px',
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                borderRadius: '50px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                background: 'linear-gradient(45deg, #42a5f5 30%, #1e88e5 90%)', // 青のグラデーション
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
                                    background: 'linear-gradient(45deg, #64b5f6 30%, #2196f3 90%)',
                                },
                            }}
                        >
                            シラバスで履修コードを探す
                        </Button>
                        <Paper sx={{
                            padding: { xs: '20px', sm: '25px', md: '30px' },
                            mb: { xs: 2, sm: 3, md: 4 },
                            backgroundColor: '#ffffff', // 入力フィールドの背景を白に設定
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                            borderRadius: '12px',
                        }}>
                            <FormInput
                                courseId={courseId}
                                onCourseIdChange={setCourseId}
                                onSubmit={handleSubmit}
                            />
                        </Paper>
                        <Paper sx={{
                            padding: { xs: '20px', sm: '25px', md: '30px' },
                            backgroundColor: '#ffffff', // 入力フィールドの背景を白に設定
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                            borderRadius: '12px',
                        }}>
                            <CourseDetails data={data} />
                            <Alerts success={success} error={error} />
                            <Grid container justifyContent="center" spacing={2} sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={isUpdate ? handleUpdate : handleSave}
                                        sx={{
                                            background: (!data || !data.cN || !data.ins || !data.rCode)
                                                ? 'grey'
                                                : 'linear-gradient(45deg, #42a5f5 30%, #1e88e5 90%)', // 青のグラデーション
                                            color: '#fff',
                                            padding: '12px 24px',
                                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                            transition: 'all 0.3s',
                                            borderRadius: '50px',
                                            cursor: (!data || !data.cN || !data.ins || !data.rCode) ? 'not-allowed' : 'pointer',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
                                                background: 'linear-gradient(45deg, #64b5f6 30%, #2196f3 90%)',
                                            },
                                        }}
                                        disabled={!data || !data.cN || !data.ins || !data.rCode}
                                    >
                                        {isUpdate ? '授業情報を更新する' : '授業を登録する'}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleCancel}
                                        sx={{
                                            padding: '12px 24px',
                                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                            borderRadius: '50px',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                            },
                                        }}
                                    >
                                        キャンセル
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Container>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AddClassModal;
