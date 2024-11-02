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
} from '@mui/material';
import { styled } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import GradeCreationPage from './gradeCreation';
import { useSession } from 'next-auth/react';
import { Grade as GradeIcon } from '@mui/icons-material';

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

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        // Simulated API call
        const response = await new Promise(resolve =>
          setTimeout(() => resolve([
            { id: 1, name: 'Assignment 1', marksObtained: 85, totalMarks: 100, dueDate: '2023-06-30', submittedDate: '2023-06-29' },
            { id: 2, name: 'Quiz 1', marksObtained: 18, totalMarks: 20, dueDate: '2023-07-15', submittedDate: '2023-07-15' },
            { id: 3, name: 'Assignment 2', marksObtained: 92, totalMarks: 100, dueDate: '2023-07-31', submittedDate: '2023-07-30' },
          ]), 1000)
        );
        // Sort the grades by due date in ascending order
        const sortedGrades = response.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setGrades(sortedGrades);
        calculateOverallGrade(sortedGrades);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId]);

  const calculateOverallGrade = (grades) => {
    const totalMarks = grades.reduce((sum, grade) => sum + grade.totalMarks, 0);
    const obtainedMarks = grades.reduce((sum, grade) => sum + grade.marksObtained, 0);
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
    const obtainedMarks = grades.reduce((sum, grade) => sum + grade.marksObtained, 0);
    return (obtainedMarks / totalMarks) * 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

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

      <GradeCard>
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
            Total Points: {grades.reduce((sum, grade) => sum + grade.marksObtained, 0)} / {grades.reduce((sum, grade) => sum + grade.totalMarks, 0)}
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
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="right">Submitted</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {grades.map((grade) => {
              const percentage = (grade.marksObtained / grade.totalMarks) * 100;
              return (
                <StyledTableRow key={grade.id}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                    {grade.name}
                  </TableCell>
                  <TableCell align="center">{grade.marksObtained}</TableCell>
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
                  <TableCell align="right">
                    {new Date(grade.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(grade.submittedDate).toLocaleDateString()}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </GradeContainer>
  );
};

export default GradePage;
