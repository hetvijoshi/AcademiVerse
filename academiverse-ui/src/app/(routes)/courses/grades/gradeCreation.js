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
  Link,
  Snackbar,
  Alert
} from '@mui/material';
import { Grade as GradeIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getInstructGrades } from '../../../services/gradeService';
import { EmptyStateContainer } from '../../../../components/EmptyState/EmptyState';

const GradeCreationContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  //marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchInstructGrades = async () => {
    try {
      // Simulated API call
      const response = await getInstructGrades(courseId, session.id_token);
      if (!response.isError) {
        setGrades(response.data);
      } else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error',
        });
      }
      setLoading(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error while fetching grades.",
        severity: 'error',
      });
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
    } else {
      router.push(`/courses?id=${courseId}&section=gradesDetail&quizId=${grade.quizId}`);
    }

  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Grade Management
        </Typography>
      </TitleSection>
      {grades.length > 0 ? <><TableContainer component={Paper} style={{ margin: '24px 0 0 0' }}>
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
      </TableContainer></> :
        <EmptyStateContainer>
          <GradeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Grades Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 450 }}>
            There are no grades available yet for this course. Once students submit their assignments or quizzes,
            you will be able to view and manage their grades here. 
          </Typography>
        </EmptyStateContainer>}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GradeCreationContainer>
  );
};

export default GradeCreationPage;
