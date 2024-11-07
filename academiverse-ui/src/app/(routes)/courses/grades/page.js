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
  CircularProgress,
  Card,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import GradeCreationPage from './gradeCreation';
import { useSession } from 'next-auth/react';
import { Grade as GradeIcon } from '@mui/icons-material';
import { getStudentGrades } from '../../../services/gradeService'
import dayjs from 'dayjs';
import { EmptyStateContainer } from '../../../../components/EmptyState/EmptyState';

const GradeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: '0.875rem',
    padding: theme.spacing(2),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.grey[50],
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiTableCell-root': {
    padding: theme.spacing(2),
    fontSize: '0.875rem',
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  },
}));

const GradeCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

const GradeCircle = styled(Box)(({ theme, grade }) => {
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return '#22c55e'; // Green
      case 'B': return '#3b82f6'; // Blue
      case 'C': return '#f59e0b'; // Yellow
      case 'D': return '#ef4444'; // Red
      case 'F': return '#dc2626'; // Dark Red
      default: return theme.palette.grey[500];
    }
  };

  return {
    width: 90,
    height: 90,
    borderRadius: '50%',
    backgroundColor: getGradeColor(grade),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };
});

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[100],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  },
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const GradePage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallGrade, setOverallGrade] = useState('');
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const { data: session } = useSession();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchGrades = async () => {
    try {
      // Simulated API call
      const response = await getStudentGrades(courseId, session.userDetails?.userId, session.id_token);
      if (!response.isError) {
        const data = response.data;
        const sortedGrades = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setGrades(sortedGrades);
        calculateOverallGrade(sortedGrades);
        setLoading(false);
      } else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error',
        });
      }
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
    fetchGrades();
  }, [courseId]);

  const calculateOverallGrade = (grades) => {
    const totalMarks = grades.reduce((sum, grade) => sum + grade.totalMarks, 0);
    const obtainedMarks = grades.reduce((sum, grade) => sum + grade.obtainedMarks, 0);
    const percentage = (obtainedMarks / totalMarks) * 100;

    let grade;
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';

    setOverallGrade(grade);
  };

  const calculatePercentage = (grades) => {
    const totalMarks = grades.reduce((sum, grade) => sum + grade.totalMarks, 0);
    const obtainedMarks = grades.reduce((sum, grade) => sum + grade.obtainedMarks, 0);
    return (obtainedMarks / totalMarks) * 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (session?.userDetails?.role === 'professor') {
    return <GradeCreationPage courseId={courseId} />;
  }

  const percentage = calculatePercentage(grades);

  return (
    <GradeContainer>
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Course Grades
        </Typography>
      </TitleSection>

      {grades.length > 0 ? <><GradeCard>
        <GradeCircle grade={overallGrade}>
          {overallGrade}
        </GradeCircle>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight="600" color="text.primary">
              Overall Performance
            </Typography>
            <Typography variant="h6" fontWeight="600" color="primary.main">
              {percentage.toFixed(1)}%
            </Typography>
          </Box>
          <ProgressBar
            variant="determinate"
            value={percentage}
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Total Points: {grades.reduce((sum, grade) => sum + grade.obtainedMarks, 0)} / {grades.reduce((sum, grade) => sum + grade.totalMarks, 0)}
          </Typography>
        </Box>
      </GradeCard>

        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Out of</TableCell>
                <TableCell align="center">Percentage</TableCell>
                <TableCell align="center">Due Date</TableCell>
                <TableCell align="center">Submitted</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {grades.map((grade) => {
                const percentage = (grade.obtainedMarks / grade.totalMarks) * 100;
                return (
                  <StyledTableRow key={grade.gradeId}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {grade.gradeTitle}
                    </TableCell>
                    <TableCell align="center">{grade.obtainedMarks}</TableCell>
                    <TableCell align="center">{grade.totalMarks}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <ProgressBar
                          variant="determinate"
                          value={percentage}
                          sx={{ width: 60 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {dayjs(grade.quiz !== null ? grade.quiz.quizDueDate : grade.assignment.assignmentDueDate).format('YYYY-MM-DD hh:mm A')}
                    </TableCell>
                    <TableCell align="center">
                      {dayjs(grade.createdAt).format('YYYY-MM-DD hh:mm A')}
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
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
        </StyledTableContainer></> :
        <EmptyStateContainer>
          <GradeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Grades Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 450 }}>
            Start engaging with your students by creating your first course announcement.
          </Typography>
        </EmptyStateContainer>}
    </GradeContainer>
  );
};

export default GradePage;
