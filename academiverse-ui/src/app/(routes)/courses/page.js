'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import CourseNavBar from '../../../components/LayoutWrapper/CourseNavBar';
import { useSearchParams } from 'next/navigation';
import AnnouncementPage from './announcements/annoucement';
import ModulePage from './modules/page';
import AssignmentPage from './assignments/page';
import GradePage from './grades/page';
import AssignmentDetail from './assignments/assignmentDetail/page';
import ToDoListScreen from './toDoList/page';
import QuizPage from './quiz/page';
import ClassmatePage from './classmates/page'
import EnrollmentPage from './enrollment/page'

const PageContainer = styled(Box)({
  display: 'flex',
  width: '100%',
});

const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
}));

const CoursePage = () => {
  const [courseId, setCourseId] = useState(null);
  const [course, setCourse] = useState(null);
  const searchParams = useSearchParams();
  const staticCourses = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', color: '#FFB74D', days: ['Monday', 'Wednesday'], startTime: '09:00', endTime: '10:30' },
    { id: 2, code: 'CS201', name: 'Data Structures', color: '#64B5F6', days: ['Tuesday', 'Thursday'], startTime: '11:00', endTime: '12:30' },
    { id: 3, code: 'MATH101', name: 'Calculus I', color: '#81C784', days: ['Monday', 'Wednesday', 'Friday'], startTime: '14:00', endTime: '15:00' },
  ];

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      //API for course detail
      setCourse(staticCourses.find(x=> x.id == id))
      setCourseId(id);
    }
  }, [searchParams]);

  const renderContent = () => {
    return (
      <PageContainer>
        <CourseNavBar course={course} />
        <ContentArea>
          {(searchParams.get('section') === 'announcements' || searchParams.get('section') === null) && <AnnouncementPage course={{ id: courseId }} />}
          {searchParams.get('section') === 'modules' && <ModulePage course={{ id: courseId }} />}
          {searchParams.get('section') === 'assignments' && <AssignmentPage course={{ id: courseId }} />}
          {searchParams.get('section') === 'assignmentDetail' && searchParams.get('assignmentId') && <AssignmentDetail assignment={parseInt(searchParams.get('assignmentId'))} />}
          {searchParams.get('section') === 'grades' && <GradePage />}
          {searchParams.get('section') === 'quiz' && <QuizPage />}
          {searchParams.get('section') === 'todo' && <ToDoListScreen />}
          {searchParams.get('section') === 'classmates' && <ClassmatePage />}
          {searchParams.get('section') === 'enrollments' && <EnrollmentPage />}
        </ContentArea>
      </PageContainer>
    );
  };
  return renderContent();
};

export default CoursePage;
