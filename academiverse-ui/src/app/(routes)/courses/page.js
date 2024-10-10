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
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setCourseId(id);
    }
  }, [searchParams]);

  const renderContent = () => {
    return (
      <PageContainer>
        <CourseNavBar course={{ id: courseId }} />
        <ContentArea>
          {(searchParams.get('section') === 'announcements' || searchParams.get('section') === null) && <AnnouncementPage course={{ id: courseId }} />}
          {searchParams.get('section') === 'modules' && <ModulePage course={{ id: courseId }}/>}
          {searchParams.get('section') === 'assignments' && <AssignmentPage course={{ id: courseId }}/>}
          {searchParams.get('section') === 'assignmentDetail' && searchParams.get('assignmentId') && <AssignmentDetail assignment={parseInt(searchParams.get('assignmentId'))} />}
          {searchParams.get('section') === 'grades' && <GradePage/>}
          {searchParams.get('section') === 'todo' && <ToDoListScreen/>}
          {searchParams.get('section') === 'quiz' && <QuizPage/>}
        </ContentArea>
      </PageContainer>
    );
  };
  return renderContent();
};

export default CoursePage;
