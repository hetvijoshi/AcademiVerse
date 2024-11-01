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
import { useRouter } from 'next/navigation';

const GradeCreationContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  marginLeft: theme.spacing(2),
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

const GradeCreationPage = ({ courseId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.userDetails?.role !== 'professor') {
      router.push('/unauthorized');
      return;
    }

    const fetchAssignments = async () => {
      try {
        // Simulated API call
        const response = await new Promise(resolve =>
          setTimeout(() => resolve([
            { id: 1, name: 'Assignment 1', totalMarks: 100, minMarks: 60, avgMarks: 75, maxMarks: 95, submittedCount: 28, totalStudents: 30 },
            { id: 2, name: 'Quiz 1', totalMarks: 100, minMarks: 12, avgMarks: 16, maxMarks: 20, submittedCount: 30, totalStudents: 30 },
            { id: 3, name: 'Assignment 2', totalMarks: 100, minMarks: 70, avgMarks: 82, maxMarks: 98, submittedCount: 29, totalStudents: 30 },
          ]), 1000)
        );
        setAssignments(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [session, router]);

  const handleViewStudents = (assignmentId) => {
    router.push(`/courses?id=${courseId}&section=gradesDetail&assignmentId=${assignmentId}`);
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
            {assignments.map((assignment) => (
              <StyledTableRow key={assignment.id}>
                <TableCell component="th" scope="row" style={{ padding: '16px' }}>
                  {assignment.name}
                </TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{assignment.totalMarks}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{assignment.minMarks}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{assignment.avgMarks}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{assignment.maxMarks}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{assignment.submittedCount}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>{assignment.totalStudents}</TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewStudents(assignment.id)}
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
