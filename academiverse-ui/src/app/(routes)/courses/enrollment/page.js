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
  FormControlLabel,
  Switch
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
  //marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
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

const FilterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(2),
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const EnrollmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);
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
      const res = await getEnrolledStudents(instructId, session["id_token"]);
      if (!res.isError) {
        setAllStudents(res.data);
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

  };

  const handleEnroll = async (student) => {
    if (student.isEnrolled) {
      return;
    }
    const reqData = {
      userId: student.user.userId,
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

  const searchStudents = (searchValue) => {
    setSearchTerm(searchValue);
    setLoading(true);
    try {
      const filteredStudents = allStudents.filter(s => { return s.user.name.search(searchValue) >= 0 || s.user.userEmail.search(searchValue) >= 0 })
      console.log(searchValue, filteredStudents)
      setStudents(filteredStudents);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  const displayedStudents = showOnlyEnrolled ?
    students.filter(student => student.isEnrolled) :
    students;

  return (
    <EnrollmentContainer>
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Course Enrollment
        </Typography>
      </TitleSection>
      <SearchBox>
        <SearchField
          variant="outlined"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => searchStudents(e.target.value)}
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
      <FilterBox>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyEnrolled}
              onChange={(e) => setShowOnlyEnrolled(e.target.checked)}
              color="primary"
            />
          }
          label="Show Only Enrolled Students"
        />
      </FilterBox>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <StudentList>
          {displayedStudents.map((student, index) => (
            <StudentListItem key={student.user.userId} divider>
              <Typography variant="body1" sx={{ minWidth: '50px', color: 'text.secondary' }}>
                {index + 1}.
              </Typography>
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
