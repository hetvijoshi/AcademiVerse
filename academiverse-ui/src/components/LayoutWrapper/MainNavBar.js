'use client';

import { useRouter } from 'next/navigation';

import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, Tooltip, Drawer } from '@mui/material';
import { styled } from '@mui/system';
import { School, AccountCircle, ExitToApp, ListAlt } from '@mui/icons-material';
import { signOut } from "next-auth/react";

const drawerWidth = '64px';

const StyledDrawer = styled(Drawer)(() => ({
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
    background: 'linear-gradient(180deg, #1565C0, #1976D2)',
    color: 'white',
  },
}));

const NavItem = styled(ListItem)`
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

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
          <Tooltip title="To Do List" placement="right">
            <NavItem button onClick={() => handleItemClick('toDoList')} selected={selectedItem === 'toDoList'}>
              <ListItemIcon sx={{ color: 'white' }}><ListAlt /></ListItemIcon>
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
