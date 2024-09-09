'use client';

import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Drawer, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, ChevronLeft, Announcement as AnnouncementIcon, School as SchoolIcon,
  ViewModule as ModuleIcon, Assignment as AssignmentIcon, Grade as GradeIcon, Quiz as QuizIcon,
  List as ListIcon, People as PeopleIcon, HowToReg as EnrollmentIcon
} from '@mui/icons-material';

const drawerWidth = '20%';

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : '64px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : '64px',
    transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    overflowX: 'hidden',
    position: 'fixed',
    right: 0,
    height: '100%',
    background: 'linear-gradient(180deg, #1565C0, #1976D2)',
    color: 'white',
  },
}));

const NavItem = styled(ListItem)`
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
`;

const CourseNavBar = ({ course }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const navItems = [
    { label: 'Announcements', path: `/courses/${course.id}/announcements`, icon: <AnnouncementIcon /> },
    { label: 'Modules', path: `/courses/${course.id}/modules`, icon: <ModuleIcon /> },
    { label: 'Assignments', path: `/courses/${course.id}/assignments`, icon: <AssignmentIcon /> },
    { label: 'Grades', path: `/courses/${course.id}/grades`, icon: <GradeIcon /> },
    { label: 'Quiz', path: `/courses/${course.id}/quiz`, icon: <QuizIcon /> },
    { label: 'To Do List', path: `/courses/${course.id}/todo`, icon: <ListIcon /> },
    { label: 'Classmates', path: `/courses/${course.id}/classmates`, icon: <PeopleIcon /> },
    { label: 'Course Enrollments', path: `/courses/${course.id}/enrollments`, icon: <EnrollmentIcon /> },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavItemClick = (path) => {
    if (typeof window !== 'undefined') {
      router.push(path);
    }
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          {open ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">
            {course.name}
          </Typography>
        </Box>
      )}
      <List>
        {navItems.map((item, index) => (
          <NavItem button key={index} onClick={() => handleNavItemClick(item.path)}>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            {open && <ListItemText primary={item.label} />}
          </NavItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default CourseNavBar;
