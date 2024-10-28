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
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { enrolledStudent, getEnrolledStudents } from '../../../services/enrollService';

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
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const instructId = searchParams.get('id');
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (instructId > 0) {
      fetchEnrolledStudents();
    } else {
      router.push('/');
    }
  }, []);

  const fetchEnrolledStudents = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch enrolled students
      const res = await getEnrolledStudents(instructId, session["id_token"]);
      if (!res.isError) {
        const enrolledStudents = res.data.filter(student => { return student.isEnrolled });
        setEnrolledStudents(enrolledStudents);
        setStudents(res.data);
      } else {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching enrolled students. Please try again.',
        severity: 'error',
      });
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
      setSnackbar({
        open: true,
        message: 'Error searching students. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (student) => {
    if (student.isEnrolled) {
      return;
    }
    const reqData = {
      userId: student.userId,
      instructId: instructId,
      isActive: true,
      createdBy: session.userDetails?.userId,
    };
    setLoading(true);
    const res = await enrolledStudent(reqData, session["id_token"]);
    if (!res.isError) {
      setLoading(false);
      fetchEnrolledStudents();
    } else {
      setLoading(false);
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }

  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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
            <StudentListItem key={student.userId} divider>
              <ListItemText
                primary={`${student.user.name}`}
                secondary={student.user.userEmail}
              />
              <EnrollButton
                variant="contained"
                color={student.isEnrolled ? "default" : "secondary"}
                startIcon={<PersonAddIcon />}
                onClick={() => handleEnroll(student)}
                disabled={student.isEnrolled}
              >
                {student.isEnrolled ? "Enrolled" : "Enroll"}
              </EnrollButton>
            </StudentListItem>
          ))}
        </StudentList>
      )}
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
    </EnrollmentContainer>
  );
};

export default EnrollmentPage;
