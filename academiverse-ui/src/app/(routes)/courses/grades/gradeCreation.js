'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getInstructGrades } from '../../../services/gradeService';

const GradeCreationContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  //marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const GradeCreationPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  const fetchInstructGrades = async () => {
    try {
      // Simulated API call
      const response = await getInstructGrades(courseId, session.id_token);
      setGrades(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.userDetails?.role !== 'professor') {
      router.push('/unauthorized');
      return;
    }



    fetchInstructGrades();
  }, [session, router]);

  const handleViewStudents = (grade) => {
    if (grade.assignmentId != null) {
      router.push(`/courses?id=${courseId}&section=gradesDetail&assignmentId=${grade.assignmentId}`);
    }else{
      router.push(`/courses?id=${courseId}&section=gradesDetail&quizId=${grade.quizId}`);
    }

  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <GradeCreationContainer>
      <Typography variant="h4" fontWeight="bold" color="primary">
        Grade Management
      </Typography>
      <TableContainer component={Paper} style={{ margin: '24px 0 0 0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="center">Total Marks</StyledTableCell>
              <StyledTableCell align="center">Min Marks</StyledTableCell>
              <StyledTableCell align="center">Avg Marks</StyledTableCell>
              <StyledTableCell align="center">Max Marks</StyledTableCell>
              <StyledTableCell align="center">Submitted</StyledTableCell>
              <StyledTableCell align="center">Total Students</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade) => (
              <StyledTableRow key={grade.quizId != null ? grade.quizId : grade.assignmentId}>
                <TableCell component="th" scope="row" style={{ padding: '16px' }}>
                  {grade.gradeTitle}
                </TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{grade.totalMarks}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{grade.minMarks}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{grade.avgMarks}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{grade.maxMarks}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{grade.submittedCount}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{grade.totalStudents}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewStudents(grade)}
                  >
                    View Students
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </GradeCreationContainer>
  );
};

export default GradeCreationPage;
