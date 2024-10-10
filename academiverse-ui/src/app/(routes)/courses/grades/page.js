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
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const GradeContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '100%',
  margin: '0',
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

const OverallGrade = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  fontWeight: 'bold',
  fontSize: '1.3rem',
}));

const GradePage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallGrade, setOverallGrade] = useState('');
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <GradeContainer>
      <Typography variant="h4" gutterBottom align="left" style={{ marginBottom: '24px' }}>
        Course Grades
      </Typography>
      <TableContainer component={Paper} style={{ marginBottom: '24px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="left">Marks Obtained</StyledTableCell>
              <StyledTableCell align="left">Total Marks</StyledTableCell>
              <StyledTableCell align="left">Due Date</StyledTableCell>
              <StyledTableCell align="left">Submitted Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade) => (
              <StyledTableRow key={grade.id}>
                <TableCell component="th" scope="row" style={{ padding: '16px' }}>
                  {grade.name}
                </TableCell>
                <TableCell align="left" style={{ padding: '16px' }}>{grade.marksObtained}</TableCell>
                <TableCell align="left" style={{ padding: '16px' }}>{grade.totalMarks}</TableCell>
                <TableCell align="left" style={{ padding: '16px' }}>{new Date(grade.dueDate).toLocaleDateString()}</TableCell>
                <TableCell align="left" style={{ padding: '16px' }}>{new Date(grade.submittedDate).toLocaleDateString()}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <OverallGrade align="left">
        Overall Grade: {overallGrade}
      </OverallGrade>
    </GradeContainer>
  );
};

export default GradePage;
