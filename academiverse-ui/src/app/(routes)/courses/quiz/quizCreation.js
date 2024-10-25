'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { saveQuiz, fetchInstructQuizzes,fetchQuizById, deleteQuiz } from '../../../services/quizService';

const QuizCreationContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const QuizHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const QuizList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const QuizListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const QuizCreationPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuizId, setcurrentQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDueDate, setQuizDueDate] = useState(dayjs());
  const [quizTotalMarks, setQuizTotalMarks] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const searchParams = useSearchParams();
  const instructId = searchParams.get('id');
  const { data: session } = useSession();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchAllQuizzes = async () => {
    const res = await fetchInstructQuizzes(instructId, session["id_token"]);
    if (!res.isError) {
      setQuizzes(res.data);
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
  }

  useEffect(() => {
    // Fetch quizzes from API
    // This is a mock implementation
    fetchAllQuizzes();
  }, []);

  const handleOpenDialog = async (quizId = null) => {
    setcurrentQuizId(quizId);
    if (quizId > 0) {
      const res = await fetchQuizById(quizId, session["id_token"]);
      if (!res.isError) {
        const quiz = res.data;
        setQuizTitle(quiz.quizName);
        setQuizDueDate(dayjs(quiz.quizDueDate));
        setQuizTotalMarks(quiz.totalMarks.toString());
        setQuestions(quiz.questions);
      } else {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'error',
        });
      }
    } else {
      setQuizTitle('');
      setQuizDueDate(dayjs());
      setQuizTotalMarks('');
      setQuestions([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setcurrentQuizId(null);
  };

  const handleSaveQuiz = async () => {
    // Save quiz to API
    const reqData = {
      instructId: instructId,
      quizName: quizTitle,
      quizDescription: quizTitle,
      quizDueDate: quizDueDate.format('YYYY-MM-DDTHH:mm:ss'),
      totalMarks: quizTotalMarks,
      quizWeightage: 0.0,
      questions: questions,
      isActive: true,
      createdBy: session?.userDetails?.userId,
    }

    const res = await saveQuiz(reqData, session["id_token"]);
    if (!res.isError) {
      fetchAllQuizzes();
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }

    console.log('Saving quiz:', { quizTitle, quizDueDate, quizTotalMarks, questions });
    handleCloseDialog();
  };

  const handleAddQuestion = () => {
    if (currentQuestion && options.every(option => option !== '') && answer) {
      setQuestions([...questions, { questionText: currentQuestion, options, answer }]);
      setCurrentQuestion('');
      setOptions(['', '', '', '']);
      setAnswer('');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setCurrentQuestion(questionToEdit.questionText);
    setOptions(questionToEdit.options);
    setAnswer(questionToEdit.answer);
    // Remove the question from the list
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteQuiz = async (quizId) => {
    const res = await deleteQuiz(quizId, session["id_token"]);
    if (!res.isError) {
      fetchAllQuizzes();
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'success',
      });
    }else{
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
  }

  return (
    <QuizCreationContainer>
      <QuizHeader variant="h4">Quiz Creation</QuizHeader>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Create New Quiz
      </Button>
      <QuizList>
        {quizzes.map((quiz) => (
          <QuizListItem key={quiz.quizId}>
            <ListItemText
              primary={quiz.quizName}
              secondary={`Due: ${dayjs(quiz.quizDueDate).format('DD-MM-YYYY HH:mm')} | Total Marks: ${quiz.totalMarks}`}
            />
            <IconButton onClick={() => handleOpenDialog(quiz.quizId)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteQuiz(quiz.quizId)}>
              <DeleteIcon />
            </IconButton>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </QuizListItem>
        ))}
      </QuizList>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentQuizId ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
        <DialogContent>
          <StyledTextField
            autoFocus
            margin="dense"
            label="Quiz Title"
            type="text"
            fullWidth
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Due Date"
              value={quizDueDate}
              onChange={(newValue) => setQuizDueDate(newValue)}
              renderInput={(params) => <StyledTextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <StyledTextField
            margin="dense"
            label="Total Marks"
            type="number"
            fullWidth
            value={quizTotalMarks}
            onChange={(e) => setQuizTotalMarks(e.target.value)}
          />
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6">Questions</Typography>
          {questions.map((q, index) => (
            <Paper key={index} style={{ padding: '10px', margin: '10px 0' }}>
              <Typography variant="subtitle1">{q.questionText}</Typography>
              <Typography variant="body2">Options: {q.options.join(', ')}</Typography>
              <Typography variant="body2">Correct Answer: {q.answer}</Typography>
              <Box mt={1}>
                <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditQuestion(index)}>
                  Edit
                </Button>
                <Button size="small" startIcon={<DeleteIcon />} onClick={() => handleDeleteQuestion(index)}>
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
          <StyledTextField
            margin="dense"
            label="Question"
            type="text"
            fullWidth
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
          />
          {options.map((option, index) => (
            <StyledTextField
              key={index}
              margin="dense"
              label={`Option ${index + 1}`}
              type="text"
              fullWidth
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          ))}
          <FormControl fullWidth margin="dense" style={{ marginBottom: '16px' }}>
            <InputLabel>Correct Answer</InputLabel>
            <Select
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              label="Correct Answer"
            >
              {options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleAddQuestion} color="primary">
            Add Question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveQuiz} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </QuizCreationContainer>
  );
};

export default QuizCreationPage;
