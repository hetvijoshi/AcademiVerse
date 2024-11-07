'use client';

import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronRight, ChevronLeft, Announcement as AnnouncementIcon, School as SchoolIcon,
  ViewModule as ModuleIcon, Assignment as AssignmentIcon, Grade as GradeIcon, Quiz as QuizIcon,
  List as ListIcon, People as PeopleIcon, HowToReg as EnrollmentIcon,
  School
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Logo from '../Logo/Logo';

const NavContainer = styled(Box)(({ theme, open }) => ({
  width: open ? '240px' : '72px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
  overflowX: 'hidden',
  backgroundColor: theme.palette.background.paper,
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  '& .MuiList-root': {
    padding: theme.spacing(1),
  }
}));

const NavItem = styled(ListItem)(({ theme, isActive }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(0.25),
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    transform: 'translateX(5px)',
  },
  ...(isActive && {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.12)',
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  }),
  '& .MuiListItemIcon-root': {
    color: theme.palette.text.secondary,
    minWidth: 40,
    justifyContent: 'center',
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  justifyContent: 'center',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '84px',
}));

const CourseNavBar = ({ course = {} }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section');
  const instructId = searchParams.get('id');
  const { data: session } = useSession();
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    const items = [
      { label: 'Announcements', path: `/courses`, section: 'announcements', icon: <AnnouncementIcon /> },
      { label: 'Modules', path: `/courses`, section: 'modules', icon: <ModuleIcon /> },
      { label: 'Assignments', path: `/courses`, section: 'assignments', icon: <AssignmentIcon /> },
      { label: 'Grades', path: `/courses`, section: 'grades', icon: <GradeIcon /> },
      { label: 'Quiz', path: `/courses`, section: 'quiz', icon: <QuizIcon /> },
    ];

    if (session?.userDetails?.role === 'professor') {
      items.push({ label: 'Course Enrollments', path: `/courses`, section: 'enrollments', icon: <EnrollmentIcon /> });
    } else {
      items.push({ label: 'To Do List', path: `/courses`, section: 'todo', icon: <ListIcon /> });
      items.push({ label: 'Classmates', path: `/courses`, section: 'classmates', icon: <PeopleIcon /> });
    }

    setNavItems(items);
  }, [session]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavItemClick = (path, section) => {
    if (typeof window !== 'undefined') {
      router.push(`${path}?id=${instructId}&section=${section}`);
    }
  };

  return (
    <NavContainer open={open}>
      <HeaderBox>
        {open ? (
          <Logo onClick={() => router.push('/')} />
        ) : (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Academiverse" placement="right">
              <School
                sx={{ 
                  color: 'primary.main',
                  fontSize: '28px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(-10deg)',
                  },
                }} 
                onClick={() => router.push('/')}
              />
            </Tooltip>
          </Box>
        )}
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ 
            color: 'primary.main',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
          }}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </HeaderBox>
      <Box sx={{ 
        px: 2, 
        py: 1,
        display: 'flex', 
        alignItems: 'center',
        minHeight: '48px',
        overflow: 'hidden'
      }}>
        {open ? (
          <Typography 
            variant="subtitle1" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              whiteSpace: 'normal',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {course?.course?.courseName || 'Course Name'}
          </Typography>
        ) : (
          <Tooltip title={course?.course?.courseName || 'Course Name'} placement="right">
            <SchoolIcon sx={{ color: 'primary.main' }} />
          </Tooltip>
        )}
      </Box>
      <List sx={{ px: 2 }}>
        {navItems.map((item, index) => (
          <Tooltip 
            key={index}
            title={open ? '' : item.label} 
            placement="right"
          >
            <NavItem
              onClick={() => handleNavItemClick(item.path, item.section)}
              isActive={currentSection === item.section}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </NavItem>
          </Tooltip>
        ))}
      </List>
    </NavContainer>
  );
};

export default CourseNavBar;
