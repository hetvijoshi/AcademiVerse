import React from 'react';
import { Box, Typography } from '@mui/material';
import { School } from '@mui/icons-material';
import { styled } from '@mui/system';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  '&:hover': {
    '& .logo-icon': {
      transform: 'rotate(-10deg)',
    },
  },
}));

const LogoIcon = styled(School)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '28px',
  transition: 'transform 0.3s ease',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: '1.25rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.5px',
}));

const Logo = ({ onClick }) => {
  return (
    <LogoContainer onClick={onClick}>
      <LogoIcon className="logo-icon" />
      <LogoText variant="h6">
        Academiverse
      </LogoText>
    </LogoContainer>
  );
};

export default Logo; 