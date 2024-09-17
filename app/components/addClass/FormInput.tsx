import React from 'react';
import { TextField, Button } from '@mui/material';

interface FormInputProps {
  courseId: string;
  onCourseIdChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

const FormInput: React.FC<FormInputProps> = ({ courseId, onCourseIdChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <TextField
      fullWidth
      label="履修コード"
      variant="outlined"
      value={courseId}
      onChange={(e) => onCourseIdChange(e.target.value.trim().replace(/\s+/g, ''))}
      style={{ marginBottom: '20px' }}
    />
    <Button
  variant="contained"
  type="submit"
  disabled={!courseId.trim()}
  sx={{
    backgroundColor: courseId ? '#42a5f5' : '#bbdefb', // courseId があるときは濃い青、ないときは薄い青
    color: '#ffffff', // 白い文字
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: courseId ? '#1e88e5' : '#90caf9', // ホバー時の色を少し濃く
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
    },
  }}
>
  講義情報を取得する
</Button>

  </form>
);

export default FormInput;
