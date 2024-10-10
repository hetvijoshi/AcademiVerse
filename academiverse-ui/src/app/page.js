'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import {
  Announcement as AnnouncementIcon,
  ViewModule as ModuleIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Quiz as QuizIcon,
  List as ListIcon,
  People as PeopleIcon,
  HowToReg as EnrollmentIcon,
  Add as AddIcon
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
  justifyContent: 'space-between',
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
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const { data: session } = useSession();

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

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    router.push(`/courses?id=${courseId}`);
  };

  const handleAddCourse = () => {
    // Implement add course functionality
    console.log('Add course clicked');
  };

  const icons = [
    { icon: <AnnouncementIcon />, label: 'Announcements' },
    { icon: <ModuleIcon />, label: 'Modules' },
    { icon: <AssignmentIcon />, label: 'Assignments' },
    { icon: <GradeIcon />, label: 'Grades' },
    { icon: <QuizIcon />, label: 'Quiz' },
    { icon: <ListIcon />, label: 'To Do List' },
    { icon: <PeopleIcon />, label: 'Classmates' },
    { icon: <EnrollmentIcon />, label: 'Enrollments' },
  ];

  const isProfessor = session?.userDetails?.role === 'professor';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <TitleSection>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          My Academic Journey
        </Typography>
      </TitleSection>
      <ContentSection>
        {isProfessor && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2, paddingRight: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddCourse}
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#45a049' },
                maxWidth: 'calc(100% - 16px)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              Add Course
            </Button>
          </Box>
        )}
        <CourseContainer>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {courses.map((course) => (
                <CourseItem key={course.id}>
                  <StyledCard
                    bgcolor={course.color}
                    onClick={() => handleCourseClick(course.id)}
                    sx={{
                      border: selectedCourseId === course.id ? '2px solid #1976D2' : 'none',
                      boxShadow: selectedCourseId === course.id ? '0 0 10px rgba(25, 118, 210, 0.5)' : 'none'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" >
                        Course ID: {course.id}
                      </Typography>
                      <IconContainer>
                        {icons.map((item, index) => (
                          <IconButton
                            key={index}
                            title={item.label}
                          >
                            {item.icon}
                          </IconButton>
                        ))}
                      </IconContainer>
                    </CardContent>
                  </StyledCard>
                </CourseItem>
              ))}
            </>
          )}
        </CourseContainer>
      </ContentSection>
    </Box>
  );
};

export default CourseScreen;
