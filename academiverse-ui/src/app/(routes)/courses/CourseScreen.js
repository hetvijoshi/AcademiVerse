'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import {
  Announcement as AnnouncementIcon,
  ViewModule as ModuleIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Quiz as QuizIcon,
  List as ListIcon,
  People as PeopleIcon,
  HowToReg as EnrollmentIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme, bgcolor }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  backgroundColor: bgcolor,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: theme.spacing(2),
}));

const CourseContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
}));

const CourseItem = styled(Box)(({ theme }) => ({
  flexBasis: 'calc(33.333% - ${theme.spacing(2)})',
  [theme.breakpoints.down('md')]: {
    flexBasis: 'calc(50% - ${theme.spacing(2)})',
  },
  [theme.breakpoints.down('sm')]: {
    flexBasis: '100%',
  },
}));

const TitleSection = styled(Box)(({ theme }) => ({
  height: '15vh',
  width: '100%',
  background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: theme.spacing(0, 4),
}));

const ContentSection = styled(Box)(({ theme }) => ({
  height: '85vh',
  width: '100%',
  padding: theme.spacing(3),
  overflowY: 'auto',
}));

const CourseScreen = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating an API call to fetch courses
    const fetchCourses = async () => {
      try {
        // Replace this with your actual API call
        const response = await new Promise(resolve => 
          setTimeout(() => resolve([
            { id: '1', name: 'Introduction to Computer Science', color: '#FFE866' },
            { id: '2', name: 'Data Structures and Algorithms', color: '#BFFBBF' },
            { id: '3', name: 'Web Development Fundamentals', color: '#B3E0FF' },
          ]), 1000)
        );
        setCourses(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleIconClick = (courseId, path) => {
    router.push(`/courses/${courseId}${path}`);
  };

  const icons = [
    { icon: <AnnouncementIcon />, path: '/announcements', label: 'Announcements' },
    { icon: <ModuleIcon />, path: '/modules', label: 'Modules' },
    { icon: <AssignmentIcon />, path: '/assignments', label: 'Assignments' },
    { icon: <GradeIcon />, path: '/grades', label: 'Grades' },
    { icon: <QuizIcon />, path: '/quiz', label: 'Quiz' },
    { icon: <ListIcon />, path: '/todo', label: 'To Do List' },
    { icon: <PeopleIcon />, path: '/classmates', label: 'Classmates' },
    { icon: <EnrollmentIcon />, path: '/enrollments', label: 'Enrollments' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <TitleSection>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          My Academic Journey
        </Typography>
      </TitleSection>
      <ContentSection>
        <CourseContainer>
          {loading ? (
            <CircularProgress />
          ) : (
            courses.map((course) => (
              <CourseItem key={course.id}>
                <StyledCard bgcolor={course.color}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Course ID: {course.id}
                    </Typography>
                    <IconContainer>
                      {icons.map((item, index) => (
                        <IconButton
                          key={index}
                          onClick={() => handleIconClick(course.id, item.path)}
                          title={item.label}
                        >
                          {item.icon}
                        </IconButton>
                      ))}
                    </IconContainer>
                  </CardContent>
                </StyledCard>
              </CourseItem>
            ))
          )}
        </CourseContainer>
      </ContentSection>
    </Box>
  );
};

export default CourseScreen;
