import React, { ReactNode, MouseEventHandler } from 'react';
import { Button } from '@mui/material';

interface GradientButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({ children, onClick, disabled }) => (
  <Button
    variant="contained"
    onClick={onClick}
    disabled={disabled}
    style={{
      background: 'linear-gradient(30deg, #6a11cb 0%, #2575fc 100%)',
      color: '#fff',
      padding: '10px 20px',
      fontSize: '16px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.2s',
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    {children}
  </Button>
);

export default GradientButton;
