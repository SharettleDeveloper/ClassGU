import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import SearchModal from './SearchModal';
import SearchIcon from '@mui/icons-material/Search'; // 検索アイコンをインポート

const SearchPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', textAlign: 'center', paddingTop: '2rem' }}>
            <TextField
                label=""
                variant="outlined"  // Outline variant gives a clean border similar to Google's style
                placeholder="検索"
                onClick={() => setIsModalOpen(true)}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <SearchIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', mr: 1 }} />
                    ),
                    sx: {
                        backgroundColor: 'white', // 白い背景色
                        borderRadius: '9999px', // 丸みを帯びた角を作成
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // 軽い影を追加
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent', // 枠線の色を透明に
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent', // ホバー時の枠線の色も透明に
                        },
                    },
                }}
            />
            <SearchModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Box>

    );
};

export default SearchPage;
