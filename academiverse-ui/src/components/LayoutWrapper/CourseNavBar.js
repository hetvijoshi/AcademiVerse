'use client';

import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronRight, ChevronLeft, Announcement as AnnouncementIcon, School as SchoolIcon,
  ViewModule as ModuleIcon, Assignment as AssignmentIcon, Grade as GradeIcon, Quiz as QuizIcon,
  List as ListIcon, People as PeopleIcon, HowToReg as EnrollmentIcon
} from '@mui/icons-material';

const NavContainer = styled(Box)(({ theme, open }) => ({
  width: open ? '240px' : '64px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
  overflowX: 'hidden',
  background: 'linear-gradient(180deg, #1565C0, #1976D2)',
  color: 'white',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const NavItem = styled(ListItem)(({ theme, isActive }) => `
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
  ${isActive && `
    background-color: rgba(255, 255, 255, 0.3);
    &:hover {
      background-color: rgba(255, 255, 255, 0.4);
    }
  `}
`);

const CourseNavBar = ({ course = {} }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section');

  const navItems = [
    { label: 'Announcements', path: `/courses`, section: 'announcements', icon: <AnnouncementIcon /> },
    { label: 'Modules', path: `/courses`, section: 'modules', icon: <ModuleIcon /> },
    { label: 'Assignments', path: `/courses`, section: 'assignments', icon: <AssignmentIcon /> },
    { label: 'Grades', path: `/courses`, section: 'grades', icon: <GradeIcon /> },
    { label: 'Quiz', path: `/courses`, section: 'quiz', icon: <QuizIcon /> },
    { label: 'To Do List', path: `/courses`, section: 'todo', icon: <ListIcon /> },
    { label: 'Classmates', path: `/courses`, section: 'classmates', icon: <PeopleIcon /> },
    { label: 'Course Enrollments', path: `/courses`, section: 'enrollments', icon: <EnrollmentIcon /> },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavItemClick = (path, section) => {
    if (typeof window !== 'undefined') {
      router.push(`${path}?id=${course.id}&section=${section}`);
    }
  };

  return (
    <NavContainer open={open}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          {open ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      <Box sx={{ p: 2, height: '56px', display: 'flex', alignItems: 'center' }}>
        {open ? (
          <Typography variant="h6" component="div" noWrap>
            {course.name || 'Course Name'}
          </Typography>
        ) : (
          <Tooltip title={course.name || 'Course Name'} placement="right">
            <SchoolIcon />
          </Tooltip>
        )}
      </Box>
      <List>
        {navItems.map((item, index) => (
          <Tooltip title={open ? '' : item.label} placement="right" key={index}>
            <NavItem
              onClick={() => handleNavItemClick(item.path, item.section)}
              isActive={currentSection === item.section}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: open ? '56px' : '24px' }}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </NavItem>
          </Tooltip>
        ))}
      </List>
    </NavContainer>
  );
};

export default CourseNavBar;
