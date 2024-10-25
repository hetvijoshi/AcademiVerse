'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import CourseNavBar from '../../../components/LayoutWrapper/CourseNavBar';
import { useRouter, useSearchParams } from 'next/navigation';
import AnnouncementPage from './announcements/annoucement';
import ModulePage from './modules/page';
import AssignmentPage from './assignments/page';
import GradePage from './grades/page';
import AssignmentDetail from './assignments/assignmentDetail/page';
import ToDoListScreen from './toDoList/page';
import QuizPage from './quiz/page';
import ClassmatePage from './classmates/page';
import EnrollmentPage from './enrollment/page';
import GradesDetail from './grades/gradesDetail';
import { getInstruct } from '../../services/instructService';
import { useSession } from 'next-auth/react';

const PageContainer = styled(Box)({
  display: 'flex',
  width: '100%',
});

const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
}));

const CoursePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [courseId, setCourseId] = useState(null);
  const [course, setCourse] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setCourseId(id);
      //API for course detail
      getInstruct(id, session["id_token"]).then(res => {
        if (!res.isError) {
          setCourse(res.data);
        }
      });
    } else {
      router.push(`/`);
    }
  }, [searchParams]);

  const renderContent = () => {
    return (
      <PageContainer>
        <CourseNavBar course={course} />
        <ContentArea>
          {(searchParams.get('section') === 'announcements' || searchParams.get('section') === null) && <AnnouncementPage />}
          {searchParams.get('section') === 'modules' && <ModulePage />}
          {searchParams.get('section') === 'assignments' && <AssignmentPage />}
          {searchParams.get('section') === 'assignmentDetail' && searchParams.get('assignmentId') && <AssignmentDetail assignment={parseInt(searchParams.get('assignmentId'))} />}
          {searchParams.get('section') === 'grades' && <GradePage />}
          {searchParams.get('section') === 'gradesDetail' && searchParams.get('assignmentId') && <GradesDetail assignmentId={parseInt(searchParams.get('assignmentId'))} />}
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
