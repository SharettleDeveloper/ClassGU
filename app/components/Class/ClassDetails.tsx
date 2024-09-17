import React, { useState } from 'react';
import { Grid, Box, Typography, Divider, Button, Collapse, IconButton, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InfoIcon from '@mui/icons-material/Info';
import LastUpdated from './LastUpdated'; // LastUpdatedコンポーネントをインポート
import { FavoriteButton } from '../MyClass/ClassButton';


const theme = createTheme();

const ClassDetails: React.FC<{ classData: any }> = ({ classData }) => {
    const [expanded, setExpanded] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, position: 'relative' }}>
                <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Grid item xs>
                        <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" color="#1565C0" sx={{ wordBreak: 'break-word' }}>
                            {classData.cN}
                        </Typography>
                        {classData.cNE && (
                            <Typography variant="body2" color="text.secondary">
                                {classData.cNE}
                            </Typography>
                        )}
                    </Grid>
                </Grid>

                <Grid container spacing={0.5}>
                    <Grid item xs={12} sm={6}>
                        <InfoSection icon={<PersonIcon />} title="教授" content={classData.ins} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoSection icon={<PlaceIcon />} title="場所" content={classData.loc} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoSection icon={<CalendarTodayIcon />} title="時間" content={`${classData.trm}期 / ${classData.dWk}曜 / ${classData.prd}限`} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoSection icon={<CreditCardIcon />} title="単位" content={classData.crd} />
                    </Grid>
                </Grid>

                <Grid item display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <IconButton
                            onClick={toggleExpand}
                            size="large"
                            sx={{
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: '0.7s',
                                bgcolor: '#1565c0',
                                color: 'white',
                                '&:hover': { bgcolor: '#29B6F6' }
                            }}
                        >
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Box>
                        <FavoriteButton classId={classData.id} />
                    </Box>
                </Grid>

                <Collapse in={expanded}>
                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                            <Typography variant="subtitle2" fontWeight="bold">学部:</Typography>
                            <Typography variant="body2">{classData.dpt}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <Typography variant="subtitle2" fontWeight="bold">授業形式:</Typography>
                            <Typography variant="body2">{classData.fmt}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <Typography variant="subtitle2" fontWeight="bold">授業コード:</Typography>
                            <Typography variant="body2">{classData.rCode}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <Typography variant="subtitle2" fontWeight="bold">授業カテゴリ:</Typography>
                            <Typography variant="body2">{classData.sCat}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <Typography variant="subtitle2" fontWeight="bold">課程:</Typography>
                            <Typography variant="body2">{classData.sCls}</Typography>
                        </Grid>
                        {classData.note && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight="bold">備考:</Typography>
                                <Typography variant="body2">{classData.note}</Typography>
                            </Grid>
                        )}
                    </Grid>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            href={classData.sUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' }, px: 5, py: 1.5, borderRadius: '30px' }}
                        >
                            シラバスを見る
                        </Button>
                    </Box>



                    <Box sx={{ mt: 2 }}>
                        <LastUpdated timestamp={classData.cAt?.toDate()} />
                    </Box>
                </Collapse>
            </Box>
        </ThemeProvider>
    );
};

const InfoSection: React.FC<{ icon: React.ReactNode, title: string, content: string }> = ({ icon, title, content }) => (
    <Box display="flex" alignItems="center">
        <Box sx={{ color: '#1976d2', mr: 1 }}>{icon}</Box>
        <Typography variant="body2">
            <strong>{title}:</strong> {content}
        </Typography>
    </Box>
);

export default ClassDetails;
