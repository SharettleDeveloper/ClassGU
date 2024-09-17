import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Avatar, TextField, MenuItem, Box, Select, FormControl, Grow } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled, keyframes } from '@mui/system';
import { useProfile } from './ProfileContext'; // ProfileContextをインポート
import { useAuth } from '../Auth/AuthContext'; // AuthContextからuseAuthをインポート

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  photoURL: string | null;
}

interface DepartmentWithCourses {
  name: string;
  majors: string[];
  courses: {
    [major: string]: string[];
  };
}

interface DepartmentWithoutCourses {
  name: string;
  majors: string[];
}

type Department = DepartmentWithCourses | DepartmentWithoutCourses;

const departments: Department[] = [
  { name: '教育学部', majors: [] },
  { name: '地域科学部', majors: ['地域政策学科', '地域文化学科'] },
  { name: '医学部', majors: ['医学科', '看護学科'] },
  {
    name: '応用生物科学部', majors: ['共同獣医学科', '応用生命科学課程'], courses: {
      '応用生命科学課程': ['分子生命科学コース', '食品生命科学コース'],
      '共同獣医学科': ['獣医コース']
    }
  },
  {
    name: '工学部', majors: ['社会基盤工学科', '機械工学科', '化学生命工学科', '電気電子・情報工学科'], courses: {
      '社会基盤工学科': ['環境コース', '防災コース'],
      '機械工学科': ['機械コース', '知能機械コース'],
      '化学生命工学科': ['物質科学コース', '生命科学コース'],
      '電気電子・情報工学科': ['電気電子コース', '情報コース', '応用物理コース']
    }
  }
];

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
`;

const successFadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledDialogTitle = styled(DialogTitle)({
  backgroundColor: '#FBE9E7', // 背景色を白に設定
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column', // 縦に並べる
  alignItems: 'center', // 中央揃え
  fontWeight: 'bold', // 太字に設定
  fontFamily: 'Arial, sans-serif', // フォントを設定（必要に応じて変更可能）
  padding: '16px 24px', // 適切な余白を設定
});

const StyledDialogActions = styled(DialogActions)({
  backgroundColor: '#FBE9E7', // 背景色を白に設定
  position: 'relative',
  zIndex: 1,
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    animation: `${fadeIn} 0.5s ease-out`,
    // backgroundImage: 'url("/profile04.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 0,
  },
  '&.MuiDialog-exiting .MuiPaper-root': {
    animation: `${fadeOut} 0.5s ease-out`,
  },
}));

const StyledTextField = styled(TextField)({
  backgroundColor: '#FFFFFF', // 背景色を白に設定
  borderRadius: '5px'
});

const SuccessMessage = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'green',
  animation: `${successFadeIn} 0.8s ease-in-out`,
});

const ErrorMessage = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'red',
  animation: `${successFadeIn} 0.8s ease-in-out`,
});

const StyledDialogContent = styled(DialogContent)({
  background: '#FFAB91',
  overflowY: 'auto',
  scrollbarWidth: 'none', // Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome, Safari, Opera
  },
  position: 'relative',
  zIndex: 1,
});

const ProfileModal = ({ open, onClose, user }: ProfileModalProps) => {
  const { profile, updateProfile } = useProfile();
  const { currentUser } = useAuth(); // authから現在のユーザーを取得
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>(currentUser?.email || ''); // authのemailを設定
  const [year, setYear] = useState<string>('');
  const [faculty, setFaculty] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [newPhotoURL, setNewPhotoURL] = useState<string>(profile?.photoURL || '');
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [profileExistsMessage, setProfileExistsMessage] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setYear(profile.year || '');
      setFaculty(profile.faculty || '');
      setDepartment(profile.department || '');
      setCourse(profile.course || '');
      setNewPhotoURL(profile.photoURL || '');
      setEmail(currentUser?.email || ''); // authからのemailを使用
    }
  }, [profile, currentUser]);

  const handleSave = async () => {
    const updatedProfile = {
      displayName,
      email,
      year,
      faculty,
      department,
      course,
      photoURL: newPhotoURL,
    };

    await updateProfile(updatedProfile);

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
    }, 1500);
  };


  // const handlePhotoURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewPhotoURL(e.target.value);
  // };


  // const [newPhotoURL, setNewPhotoURL] = useState('');
  const [error, setError] = useState('');

  const handlePhotoURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url.length <= 100) {
      setNewPhotoURL(url);
      setError(''); // エラーメッセージをクリア
    } else {
      setError('URLは100文字以内にしてください');
    }
  };

  const departmentOptions = departments.map(dept => (
    <MenuItem key={dept.name} value={dept.name}>
      {dept.name}
    </MenuItem>
  ));

  const majorOptions = (departments.find(dept => dept.name === faculty) as DepartmentWithCourses)?.majors.map((major: string) => (
    <MenuItem key={major} value={major}>
      {major}
    </MenuItem>
  )) || [];

  const courseOptions = (departments.find(dept => dept.name === faculty) as DepartmentWithCourses)?.courses?.[department] || [];

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setFaculty(event.target.value as string);
    setDepartment('');
    setCourse('');
  };

  const handleMajorChange = (event: SelectChangeEvent<string>) => {
    setDepartment(event.target.value as string);
    setCourse('');
  };

  const handleCourseChange = (event: SelectChangeEvent<string>) => {
    setCourse(event.target.value as string);
  };

  return (
    <>
      <StyledDialog open={open} onClose={onClose} TransitionComponent={Grow}>
        <StyledDialogTitle>
          <Typography variant="subtitle1" align="center">{displayName}</Typography>
          <Avatar
            alt={currentUser?.displayName || 'Guest'}
            src={newPhotoURL || undefined}  // `null` の代わりに `undefined` を使用
            sx={{
              width: 56,
              height: 56,
              margin: '0 auto',
              border: '2px solid #B0B0B0', // グレーの細い円を追加
              borderRadius: '50%', // 円形にする
            }}
          />

        </StyledDialogTitle>
        <StyledDialogContent>
          <StyledTextField

            margin="dense"
            label="プロフィール写真 URL"
            fullWidth
            value={newPhotoURL}
            onChange={handlePhotoURLChange}
            error={!!error} // エラーメッセージがあるときはTextFieldをエラー表示に
            sx={{ marginBottom: 1, marginTop: 5 }}
          />
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{
                marginTop: -3,
                padding: '4px 8px',
                backgroundColor: '#ffe6e6', // 薄い赤背景でエラーメッセージを目立たせる
                borderRadius: '4px',
                fontSize: '0.875rem', // フォントサイズを少し小さめに
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)', // 軽いシャドウを追加して目立たせる
              }}
            >
              {error}
            </Typography>
          )}


          <StyledTextField
            margin="dense"
            label="ニックネーム"
            fullWidth
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            sx={{ marginBottom: 1 }} // 余白を追加
          />
          <StyledTextField
            margin="dense"
            label="メールアドレス"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
            sx={{ marginBottom: 1 }} // 余白を追加
          />
          <FormControl fullWidth margin="dense" sx={{ marginBottom: 1 }}>
            <Typography>学年</Typography>
            <Select
              value={year}
              onChange={(e: SelectChangeEvent<string>) => setYear(e.target.value)}
              sx={{ backgroundColor: '#FFFFFF' }}
            >
              <MenuItem value="1">1年生</MenuItem>
              <MenuItem value="2">2年生</MenuItem>
              <MenuItem value="3">3年生</MenuItem>
              <MenuItem value="4">4年生</MenuItem>
              <MenuItem value="5">5年生</MenuItem>
              <MenuItem value="6">6年生</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ marginBottom: 1 }}>
            <Typography>学部</Typography>
            <Select
              value={faculty}
              onChange={handleDepartmentChange}
              sx={{ backgroundColor: '#FFFFFF' }}
            >
              {departmentOptions}
            </Select>
          </FormControl>
          {faculty && majorOptions.length > 0 && (
            <FormControl fullWidth margin="dense" sx={{ marginBottom: 1 }}>
              <Typography>学科</Typography>
              <Select
                value={department}
                onChange={handleMajorChange}
                sx={{ backgroundColor: '#FFFFFF' }}
              >
                {majorOptions}
              </Select>
            </FormControl>
          )}
          {department && courseOptions.length > 0 && (
            <FormControl fullWidth margin="dense" sx={{ marginBottom: 1 }}>
              <Typography>コース</Typography>
              <Select
                value={course}
                onChange={handleCourseChange}
                sx={{ backgroundColor: '#FFFFFF' }}
              >
                {courseOptions.map((courseOption) => (
                  <MenuItem key={courseOption} value={courseOption}>
                    {courseOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </StyledDialogContent>
        <StyledDialogActions>
          {successMessage && (
            <Grow in={successMessage}>
              <SuccessMessage>
                <CheckCircleIcon style={{ marginRight: '5px' }} />
                <Typography variant="h6" color="success" align="center">
                  プロフィールが更新されました！
                </Typography>
              </SuccessMessage>
            </Grow>
          )}
          {profileExistsMessage && (
            <Grow in={profileExistsMessage}>
              <ErrorMessage>
                <CheckCircleIcon style={{ marginRight: '5px' }} />
                <Typography variant="h6" color="error" align="center">
                  プロフィールが既に存在します！
                </Typography>
              </ErrorMessage>
            </Grow>
          )}
          <Button onClick={onClose} sx={{ fontWeight: 400 }} color="warning">キャンセル</Button>
          <Button onClick={handleSave} sx={{ fontWeight: 'bold' }} color="warning">保存</Button>
        </StyledDialogActions>
      </StyledDialog>
    </>
  );
};

export default ProfileModal;
