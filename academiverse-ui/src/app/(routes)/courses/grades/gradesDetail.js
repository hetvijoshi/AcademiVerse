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
  TextField,
  Button,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

const StudentGradesContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  margin: '0 auto',
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

const GradesDetail = ({ courseId, assignmentId }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentName, setAssignmentName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (session?.userDetails?.role !== 'professor') {
      router.push('/unauthorized');
      return;
    }

    const fetchStudentGrades = async () => {
      try {
        // Simulated API call
        const response = await new Promise(resolve =>
          setTimeout(() => resolve({
            assignmentName: 'Assignment 1',
            students: [
              { id: 1, name: 'John Doe', obtainedMarks: 85, totalMarks: 100 },
              { id: 2, name: 'Jane Smith', obtainedMarks: 92, totalMarks: 100 },
              { id: 3, name: 'Alice Johnson', obtainedMarks: 78, totalMarks: 100 },
              // Add more student data as needed
            ]
          }), 1000)
        );
        setAssignmentName(response.assignmentName);
        setStudents(response.students);
        setFilteredStudents(response.students);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student grades:', error);
        setLoading(false);
      }
    };

    fetchStudentGrades();
  }, [session, router, assignmentId]);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleMarksChange = (studentId, field, value) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, [field]: Number(value) } : student
      )
    );
  };

  const handleSaveGrades = async () => {
    // Implement the logic to save the updated grades
    console.log('Saving grades:', students);
    // You would typically make an API call here to update the grades in the backend
  };

  const handleBack = () => {
    router.push(`/courses?id=${courseId}&section=grades`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <StudentGradesContainer>
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Typography variant="h4" style={{ marginLeft: '16px' }}>
          Student Grades: {assignmentName}
        </Typography>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search student by name"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper} style={{ marginBottom: '24px', width: '100%' }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell align="center">Obtained Marks</StyledTableCell>
              <StyledTableCell align="center">Total Marks</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <StyledTableRow key={student.id}>
                <TableCell component="th" scope="row" style={{ padding: '16px' }}>
                  {student.name}
                </TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>
                  <TextField
                    type="number"
                    value={student.obtainedMarks}
                    onChange={(e) => handleMarksChange(student.id, 'obtainedMarks', e.target.value)}
                    inputProps={{ min: 0, max: student.totalMarks }}
                  />
                </TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>
                  <TextField
                    type="number"
                    value={student.totalMarks}
                    disabled
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSaveGrades}>
          Save Grades
        </Button>
      </Box>
    </StudentGradesContainer>
  );
};

export default GradesDetail;
