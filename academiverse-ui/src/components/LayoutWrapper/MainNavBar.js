'use client';

import { useRouter } from 'next/navigation';

import React from 'react';
import { Box, List, ListItem, ListItemIcon, Tooltip, Drawer } from '@mui/material';
import { styled } from '@mui/system';
import { School, AccountCircle, ExitToApp, ListAlt } from '@mui/icons-material';
import { signOut } from "next-auth/react";

const drawerWidth = '72px';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    overflowX: 'hidden',
    position: 'fixed',
    left: 0,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  },
}));

const NavItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
  },
  '& .MuiListItemIcon-root': {
    color: theme.palette.text.secondary,
    minWidth: 'auto',
    transition: 'color 0.3s ease',
  },
  '&:hover .MuiListItemIcon-root': {
    color: theme.palette.primary.main,
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.12)',
    },
  },
}));

const MainNavBar = ({ selectedItem }) => {
  const router = useRouter();

  const handleItemClick = (item) => {
    if (item === 'courses') {
      router.push('/');
    } else if (item === 'toDoList') {
      router.push('/toDoList');
    } else if (item === 'account') {
      router.push('/account');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer
        variant="permanent"
        open={true}
      >
        <List>
          <Tooltip title="Courses" placement="right">
            <NavItem button onClick={() => handleItemClick('courses')} selected={selectedItem === 'courses'}>
              <ListItemIcon sx={{ color: 'white' }}><School /></ListItemIcon>
            </NavItem>
          </Tooltip>
          <Tooltip title="Account" placement="right">
            <NavItem button onClick={() => handleItemClick('account')} selected={selectedItem === 'account'}>
              <ListItemIcon sx={{ color: 'white' }}><AccountCircle /></ListItemIcon>
            </NavItem>
          </Tooltip>
          <Tooltip title="Logout" placement="right">
            <NavItem button onClick={() => signOut()}>
              <ListItemIcon sx={{ color: 'white' }}><ExitToApp /></ListItemIcon>
            </NavItem>
          </Tooltip>
        </List>
      </StyledDrawer>
    </Box>
  );
};

export default MainNavBar;
