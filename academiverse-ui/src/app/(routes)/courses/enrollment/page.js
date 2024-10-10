'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const EnrollmentContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
}));

const EnrollmentHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '2rem',
  textAlign: 'center',
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const SearchField = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
  marginRight: theme.spacing(2),
}));

const StudentList = styled(List)(({ theme }) => ({
  maxHeight: '400px',
  overflow: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const StudentListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const EnrollButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const EnrollmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  const fetchEnrolledStudents = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch enrolled students
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve([
          { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
          { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
        ]), 1000)
      );
      setEnrolledStudents(response);
      setStudents(response);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      setSnackbarMessage('Error fetching enrolled students. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Simulating API call to search students
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve([
          { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
          { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
          { id: 3, firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
        ]), 1000)
      );
      setStudents(response);
    } catch (error) {
      console.error('Error searching students:', error);
      setSnackbarMessage('Error searching students. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (student) => {
    // Simulating enrollment process
    setEnrolledStudents([...enrolledStudents, student]);
    setSnackbarMessage(`Enrolled ${student.firstName} ${student.lastName} successfully!`);
    setSnackbarOpen(true);
  };

  const isEnrolled = (studentId) => {
    return enrolledStudents.some(enrolledStudent => enrolledStudent.id === studentId);
  };

  return (
    <EnrollmentContainer>
      <EnrollmentHeader variant="h4" component="h1">
        Course Enrollment
      </EnrollmentHeader>
      <SearchBox>
        <SearchField
          variant="outlined"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          disabled={loading}
        >
          Search
        </Button>
      </SearchBox>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <StudentList>
          {students.map((student) => (
            <StudentListItem key={student.id} divider>
              <ListItemText
                primary={`${student.firstName} ${student.lastName}`}
                secondary={student.email}
              />
              <EnrollButton
                variant="contained"
                color={isEnrolled(student.id) ? "default" : "secondary"}
                startIcon={<PersonAddIcon />}
                onClick={() => handleEnroll(student)}
                disabled={isEnrolled(student.id)}
              >
                {isEnrolled(student.id) ? "Enrolled" : "Enroll"}
              </EnrollButton>
            </StudentListItem>
          ))}
        </StudentList>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </EnrollmentContainer>
  );
};

export default EnrollmentPage;
