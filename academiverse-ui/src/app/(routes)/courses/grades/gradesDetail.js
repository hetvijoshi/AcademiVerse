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
  InputAdornment,
  Snackbar,
  Alert,
  Link,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { getAssignmentGrades, getQuizGrades, saveGrades } from '../../../services/gradeService';

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

const GradesDetail = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentName, setAssignmentName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentSubmission, setAssignmentSubmission] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const quizId = searchParams.get('quizId');
  const assignmentId = searchParams.get('assignmentId');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openFileViewer, setOpenFileViewer] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const fetchStudentGrades = async () => {
    try {
      let response = []
      if (quizId != null) {
        response = await getQuizGrades(quizId, session.id_token);
      } else {
        response = await getAssignmentGrades(assignmentId, session.id_token);
      }
      if (!response.isError) {
        response = response.data;
        setAssignmentName(response.quiz != null ? response.quiz.quizName : response.assignment.assignmentTitle);
        setStudents(response.grades);
        setAssignmentSubmission(response.assignmentSubmissions)
        setFilteredStudents(response.grades);
        setLoading(false);
      } else {
        setAssignmentName('');
        setStudents([]);
        setFilteredStudents([]);
        setLoading(false);
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'error',
        });
      }

    } catch (error) {
      setSnackbar({
        open: true,
        message: response.message,
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

    fetchStudentGrades();
  }, [session, router, assignmentId]);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleMarksChange = (studentId, field, value) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.user.userId === studentId ? { ...student, [field]: Number(value) } : student
      )
    );
  };

  const handleSaveGrades = async () => {
    setLoading(true);
    const reqData = {
      grades: students
    };
    const res = await saveGrades(reqData, session.id_token);
    if (!res.isError) {
      fetchStudentGrades();
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/courses?id=${courseId}&section=grades`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmissionClick = (material) => {
    setSelectedSubmission(material);
    setOpenFileViewer(true);
  };

  const handleCloseFileViewer = () => {
    setOpenFileViewer(false);
    setSelectedSubmission(null);
  };

  const getAssignmentSubmission = (userId) => {
    const as = assignmentSubmission.filter(as => {
      return as.user.userId == userId;
    });
    return as.length > 0 ? as[0] : null;
  }

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
              {!quizId && <StyledTableCell align="center">Submission</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <StyledTableRow key={student.user.userId}>
                <TableCell component="th" scope="row" style={{ padding: '16px' }}>
                  {student.user.name}
                </TableCell>
                <TableCell align="center" style={{ padding: '16px' }}>
                  <TextField
                    type="number"
                    disabled={quizId != null}
                    value={student.obtainedMarks}
                    onChange={(e) => handleMarksChange(student.user.userId, 'obtainedMarks', e.target.value)}
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
                {!quizId && (
                  <TableCell align="center" style={{ padding: '16px' }}>
                    {getAssignmentSubmission(student.user.userId) != null ? (
                      <Button
                        onClick={() => handleSubmissionClick(getAssignmentSubmission(student.user.userId)?.assignmentLink)}
                        variant="contained"
                        color="primary"
                      >
                        View Submission
                      </Button>
                    ) : (
                      "No submission"
                    )}
                  </TableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSaveGrades} disabled={quizId != null}>
          Save Grades
        </Button>
      </Box>
      <Dialog
        open={openFileViewer}
        onClose={handleCloseFileViewer}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Submission
          <IconButton
            aria-label="close"
            onClick={handleCloseFileViewer}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <iframe
              src={selectedSubmission}
              width="100%"
              height="600px"
              title="Submission"
            />
          )}
        </DialogContent>
      </Dialog>
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
    </StudentGradesContainer>
  );
};

export default GradesDetail;
