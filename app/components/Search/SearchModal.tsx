import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Box, Typography, Paper, Modal, IconButton, Button, Chip, Stack, Collapse, Grid, InputAdornment } from '@mui/material';
import { FilterList as FilterListIcon, Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';


const SearchModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [queryText, setQueryText] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string | null }>({ year: null, term: null, credits: null, day: null, });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [majors, setMajors] = useState<string[]>([]);


  useEffect(() => {
    if (open) {
      loadOrFetchData();
    }
  }, [open]);

  const loadOrFetchData = async () => {
    const localData = localStorage.getItem('classData');
    if (localData) {
      const parsedData = JSON.parse(localData);
      setResults(parsedData);
      setFilteredResults(parsedData);
      extractDynamicDepartmentsAndMajors(parsedData);
    } else {
      const docRef = doc(firestore, 'class', 'classmanage');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedResults = Object.entries(docSnap.data()).map(([key, value]) => ({
          id: key,
          ...value as any,
        }));
        localStorage.setItem('classData', JSON.stringify(fetchedResults));
        setResults(fetchedResults);
        setFilteredResults(fetchedResults);
        extractDynamicDepartmentsAndMajors(fetchedResults);
      } else {
        console.log('No such document!');
      }
    }
  };

  const fetchDataFromFirestore = async () => {
    const docRef = doc(firestore, 'class', 'classmanage');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fetchedResults = Object.entries(docSnap.data()).map(([key, value]) => ({
        id: key,
        ...value as any,
      }));
      localStorage.setItem('classData', JSON.stringify(fetchedResults));
      setResults(fetchedResults);
      setFilteredResults(fetchedResults);
      extractDynamicDepartmentsAndMajors(fetchedResults);
    } else {
      console.log('No such document!');
    }
  };

  const extractDynamicDepartmentsAndMajors = (data: any[]) => {
    const uniqueDepartments = Array.from(new Set(data.map((item) => item.dpt)));
    setDepartments(uniqueDepartments);

    if (selectedDepartment) {
      const filteredMajors = Array.from(
        new Set(data.filter((item) => item.dpt === selectedDepartment).map((item) => item.sCls))
      );
      setMajors(filteredMajors);
    }
  };

  const handleSearch = (text: string) => {
    setQueryText(text);
    if (text.length > 0) {
      const filtered = results.filter(
        (result) =>
          result.cN.toLowerCase().includes(text.toLowerCase()) ||
          result.ins.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(results);
    }
  };

  useEffect(() => {
    if (selectedDepartment) {
      extractDynamicDepartmentsAndMajors(results);
    }
  }, [selectedDepartment]);

  const handleDepartmentSelect = (department: string) => {
    // const newFilters = { ...filters, department };
    const newFilters = {
      ...filters,
      department,
      major: null, // 専攻をリセット
      year: null,
      term: null,
      credits: null,
      day: null,
    };
    setSelectedDepartment(department);
    setSelectedMajor(null); // Reset the major selection
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleMajorSelect = (major: string) => {
    const newFilters = {
      ...filters,
      // department,
      major, // 専攻をリセット
      year: null,
      term: null,
      credits: null,
      day: null,
    };

    // const newFilters = { ...filters, major };
    setSelectedMajor(major);
    setFilters(newFilters);
    applyFilters(newFilters);
  };


  const router = useRouter();

  const handleClassClick = (id: string) => {
    localStorage.setItem('selectedClassId', id); // ローカルストレージに保存
    router.push('/Class'); // Class.tsxに遷移
  };

  const applyFilters = (activeFilters: { [key: string]: string | null }) => {
    let filtered = results;

    // AND条件でフィルターを適用
    if (activeFilters.department) {
      filtered = filtered.filter((result) => result.dpt === activeFilters.department);
    }
    if (activeFilters.major) {
      filtered = filtered.filter((result) => result.sCls === activeFilters.major);
    }
    if (activeFilters.year) {
      filtered = filtered.filter((result) => result.tYr === parseInt(activeFilters.year!));
    }
    if (activeFilters.term) {
      filtered = filtered.filter((result) => result.trm === activeFilters.term);
    }
    if (activeFilters.credits) {
      filtered = filtered.filter((result) => {
        const credits = result.crd.toString(); // 数値を文字列に変換
        return credits === activeFilters.credits;
      });
    }
    if (activeFilters.day) {
      filtered = filtered.filter((result) => result.dWk === activeFilters.day);
    }

    // クエリテキストによるフィルタリング
    if (queryText) {
      filtered = filtered.filter(
        (result) =>
          result.cN.toLowerCase().includes(queryText.toLowerCase()) ||
          result.ins.toLowerCase().includes(queryText.toLowerCase())
      );
    }

    setFilteredResults(filtered);
  };

  const handleRadioChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: filters[filterType] === value ? null : value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleRefreshData = async () => {
    await fetchDataFromFirestore();
  };

  const renderDepartmentChips = () => {
    return departments.map((dept) => {
      const count = results.filter((result) => result.dpt === dept).length;
      return (
        <Chip
          key={dept}
          label={`${dept} (${count})`}
          onClick={() => handleDepartmentSelect(dept)}
          clickable
          sx={{
            backgroundColor: selectedDepartment === dept ? '#1976d2' : 'default',
            color: selectedDepartment === dept ? 'white' : 'black',
            '&:hover': {
              backgroundColor: selectedDepartment === dept ? '#1565c0' : '#e0e0e0',
            },
            marginBottom: '8px',
          }}
        />
      );
    });
  };

  const renderMajorChips = () => {
    if (selectedDepartment) {
      const majorsWithCounts = majors.map((major) => {
        const count = results.filter(
          (result) => result.sCls === major && result.dpt === selectedDepartment
        ).length;
        return { major, count };
      });

      return (
        <>
          {majorsWithCounts.map(({ major, count }) => (
            <Chip
              key={major}
              label={`${major} (${count})`}
              onClick={() => handleMajorSelect(major)}
              clickable
              sx={{
                backgroundColor: selectedMajor === major ? '#1976d2' : 'default',
                color: selectedMajor === major ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: selectedMajor === major ? '#1565c0' : '#e0e0e0',
                },
                marginBottom: '8px',
              }}
            />
          ))}
        </>
      );
    }
    return null;
  };


  const renderFilterChips = (
    labels: string[],
    counts: number[],
    filterType: string,
    currentFilterValue: string | null
  ) => {
    return labels.map((label, index) => (
      <Chip
        key={label}
        label={`${label} (${counts[index]})`}
        onClick={() => handleRadioChange(filterType, label)}
        clickable={counts[index] > 0}
        disabled={counts[index] === 0}
        sx={{
          backgroundColor: currentFilterValue === label ? '#1976d2' : 'default',
          color: currentFilterValue === label ? 'white' : 'black',
          '&:hover': {
            backgroundColor: currentFilterValue === label ? '#1565c0' : '#e0e0e0',
          },
          opacity: counts[index] > 0 ? 1 : 0.5,
          cursor: counts[index] > 0 ? 'pointer' : 'default',
          marginBottom: '8px',
          padding: { xs: '0.1px 0.1px', sm: '4px 0.5px' },
          fontSize: { xs: '0.7rem', sm: '0.875rem' }, // xsのときにフォントサイズを小さくする
        }}
      />
    ));
  };


  const renderAdvancedFilters = () => {
    // すべての結果を使ってカウントを取得
    const yearCounts = [1, 2, 3, 4].map((year) =>
      results.filter((result) =>
        (!filters.department || result.dpt === filters.department) &&
        (!filters.major || result.sCls === filters.major) &&
        (!filters.term || result.trm === filters.term) &&
        (!filters.credits || result.crd.toString() === filters.credits) &&
        (!filters.day || result.dWk === filters.day) &&
        result.tYr === year
      ).length
    );

    const termCounts = ['前', '後'].map((term) =>
      results.filter((result) =>
        (!filters.department || result.dpt === filters.department) &&
        (!filters.major || result.sCls === filters.major) &&
        (!filters.year || result.tYr === parseInt(filters.year)) &&
        (!filters.credits || result.crd.toString() === filters.credits) &&
        (!filters.day || result.dWk === filters.day) &&
        result.trm === term
      ).length
    );

    const creditCounts = ['1', '1.5', '2'].map((credits) =>
      results.filter((result) =>
        (!filters.department || result.dpt === filters.department) &&
        (!filters.major || result.sCls === filters.major) &&
        (!filters.year || result.tYr === parseInt(filters.year)) &&
        (!filters.term || result.trm === filters.term) &&
        (!filters.day || result.dWk === filters.day) &&
        result.crd.toString() === credits
      ).length
    );

    const dayCounts = ['月', '火', '水', '木', '金'].map((day) =>
      results.filter((result) =>
        (!filters.department || result.dpt === filters.department) &&
        (!filters.major || result.sCls === filters.major) &&
        (!filters.year || result.tYr === parseInt(filters.year)) &&
        (!filters.term || result.trm === filters.term) &&
        (!filters.credits || result.crd.toString() === filters.credits) &&
        result.dWk === day
      ).length
    );



    return (
      <Collapse in={showAdvancedFilters} timeout="auto" unmountOnExit>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' }
            }}
          >
            学年:
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
            {renderFilterChips(['1', '2', '3', '4'], yearCounts, 'year', filters.year)}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={0.1} alignItems="center" sx={{ mb: 0.3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' }
            }}
          >
            学期:
          </Typography>
          <Stack direction="row" spacing={0.1} sx={{ flexWrap: 'wrap', mb: 2 }}>
            {renderFilterChips(['前', '後'], termCounts, 'term', filters.term)}
          </Stack>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' }
            }}
          >
            単位数:
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', mb: 2 }}>
            {renderFilterChips(['1', '1.5', '2'], creditCounts, 'credits', filters.credits)}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' }
            }}
          >
            曜日:
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', mb: 2 }}>
            {renderFilterChips(['月', '火', '水', '木', '金'], dayCounts, 'day', filters.day)}
          </Stack>
        </Stack>
      </Collapse>


    );
  };


  const handleClearFilters = () => {
    setFilters({
      year: null,
      term: null,
      credits: null,
      day: null,
    });
    setSelectedDepartment(null);
    setSelectedMajor(null);
    setFilteredResults(results);
  };


  const [isRotated, setIsRotated] = useState(false);


  const handleIconClick = () => {
    setIsRotated(!isRotated);
    setShowAdvancedFilters(prev => !prev);
  };




  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Box sx={{ width: '95%', maxWidth: 1000, mx: 'auto', my: { xs: 0, sm: 1, md: 2, lg: 4 }, bgcolor: 'white', p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Roboto, sans-serif', // Googleらしいフォントファミリー
              fontWeight: 'bold', // 太字
              color: '#2979FF', // Googleの青色
              letterSpacing: '0.1em', // 若干の文字間隔を追加
            }}
          >

          </Typography>

          <Button onClick={onClose} color="primary">
            閉じる
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
          <TextField
            placeholder="授業または教員で検索"
            variant="outlined"
            fullWidth
            value={queryText}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'white', // 白い背景色
                borderRadius: '25px', // 丸みを帯びた角を調整
                boxShadow: '0 1px 3px rgba(32, 33, 36, 0.28)', // Google検索窓に近い影を追加
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent', // 枠線の色を透明に
                  transition: 'border-color 0.5s ease',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1E88E5', // ホバー時に色が変わる
                  transition: 'border-color 0.5s ease',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2196F3', // フォーカス時にも枠線の色を透明に
                  transition: 'border-color 0.5s ease',
                },
                '& .MuiOutlinedInput-root': {
                  padding: '20px 15px', // 内側の余白を調整して見た目を整える
                  transition: 'border-color 0.5s ease',
                },
              },
              endAdornment: (
                <IconButton onClick={() => setQueryText('')}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </Box>


        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', mb: 0.5 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 0.3 }}>
            {renderDepartmentChips()}
          </Stack>
          {selectedDepartment && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 0.5 }}>
              {renderMajorChips()}
            </Stack>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.1 }}>
            <IconButton
              onClick={handleIconClick}
              sx={{
                alignSelf: 'flex-start',
                mb: 2,
                backgroundColor: showAdvancedFilters ? '#1976d2' : 'default',
                color: showAdvancedFilters ? 'white' : 'black',
                transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: showAdvancedFilters ? '#1565c0' : '#e0e0e0',
                },
              }}
            >
              <FilterListIcon />
            </IconButton>

            <Button
              onClick={handleClearFilters}
              variant="outlined"
              sx={{
                alignSelf: 'flex-start',
                mb: 0,
                backgroundColor: '#fff',
                textTransform: 'none',
              }}
            >
              フィルターをリセット
            </Button>
          </Box>

          {renderAdvancedFilters()}
        </Box>
        <Box
          sx={{
            height: {
              xs: '53vh',  // 小さなデバイス (スマートフォンなど) ではビューポートの50%
              sm: '60vh',  // 中型のデバイス (タブレットなど) ではビューポートの60%
              md: '60vh',  // 大型のデバイス (小型のラップトップなど) ではビューポートの70%
              lg: '450px', // 特に大きなデバイス (デスクトップなど) では固定の400px
            },
            overflowY: 'auto', // 縦方向にスクロールを許可
            maxHeight: '90vh', // ビューポートの90%までの高さに制限
          }}
        >

          {filteredResults.slice(0, 30).map((result, index) => (
            <Paper
              key={result.id}
              sx={{
                p: 0.7,
                mb: 0.9,
                borderRadius: '8px', // 角を丸く
                boxShadow: 'none', // 影を削除してフラットに
                transition: 'box-shadow 0.3s ease', // 影のトランジションを設定
                cursor: 'pointer', // クリック可能な雰囲気を出すためにカーソルをポインタに
                '&:hover': {
                  boxShadow: '0 px 8px rgba(0, 0, 0, 0.1)', // ホバー時に軽く影を追加
                  backgroundColor: '#f5f5f5',
                },
                backgroundColor: '#fff', // 背景色を白に
              }}
              onClick={() => handleClassClick(result.id)}
            >
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={5}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '11px', sm: '15px', md: '17px' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#202124', // テキストカラーをGoogleっぽい色に変更
                    }}
                  >
                    {result.cN} {/* 授業名 */}
                  </Typography>
                </Grid>
                <Grid item xs={3.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '10px', sm: '12px', md: '14px' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'right', // 右揃えにして整列
                      color: '#5f6368', // サブテキストカラーを薄いグレーに変更
                    }}
                  >
                    {`${result.tYr}年 ${result.trm}期 ${result.dWk}曜 ${result.crd}単`}
                    {/* 学年、学期、単位、曜日 */}
                  </Typography>
                </Grid>
                <Grid item xs={3.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'right', // 右揃えにして整列
                      color: '#5f6368', // サブテキストカラーを薄いグレーに変更
                    }}
                  >
                    {result.ins} {/* 教師名 */}
                  </Typography>
                </Grid>
              </Grid>

            </Paper>

          ))}

          {filteredResults.length === 0 && (
            <div>

              <Typography variant="body1" color="textSecondary">
                <p>
                  お探しの授業が見つかりませんか？
                </p>
                <p>
                  その場合は「授業を追加」から登録してみましょう!
                </p>
              </Typography>
            </div>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={handleRefreshData}
            variant="outlined"
            sx={{
              animation: filteredResults.length === 0 ? 'glow 1.5s ease-in-out infinite alternate' : 'none',
              '@keyframes glow': {
                '0%': {
                  boxShadow: '0 0 5px rgba(33, 150, 243, 0.5)',
                  borderColor: '#2196F3',
                },
                '100%': {
                  boxShadow: '0 0 10px rgba(33, 150, 243, 1)',
                  borderColor: '#2196F3',
                },
              },
            }}
          >
            最新データを取得
          </Button>
        </Box>

      </Box>
    </Modal>
  );
};

export default SearchModal;
