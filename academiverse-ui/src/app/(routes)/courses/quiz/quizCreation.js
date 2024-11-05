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
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, Upload as UploadIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { saveQuiz, fetchInstructQuizzes, fetchQuizQuestions, deleteQuiz, editQuiz, activeQuiz, generateQuizQuestions } from '../../../services/quizService';

const QuizCreationContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  //marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const QuizHeader = styled(Typography)(({ theme }) => ({
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

const UploadButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginLeft: theme.spacing(2),
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const QuizCreationPage = () => {
  const [loading, setLoading] = useState(false);
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
  const [selectedFile, setSelectedFile] = useState(null);
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
    fetchAllQuizzes();
  }, []);

  const handleFileUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append('file', file);
      try {

        const res = await generateQuizQuestions(formData, session["id_token"]);
        if (!res.isError) {
          setLoading(false);
          setQuestions(res.data);
        }else{
          setSnackbar({
            open: true,
            message: res.message,
            severity: 'error',
          });
        }
      } catch (error) {
        setLoading(false);
        setQuizTitle('');
        setQuizDueDate(dayjs());
        setQuizTotalMarks('');
        setQuestions([]);
        setSnackbar({
          open: true,
          message: 'Failed to generate questions from PDF',
          severity: 'error',
        });

      }
    }
  };

  const handleOpenDialog = async (quiz = null) => {
    if (quiz?.quizId > 0 && quiz.active) {
      setcurrentQuizId(quiz?.quizId);
      setQuizTitle(quiz.quizName);
      setQuizDueDate(dayjs(quiz.quizDueDate));
      setQuizTotalMarks(quiz.totalMarks.toString());

      const quizQuestions = await fetchQuizQuestions(quiz.quizId, session["id_token"]);
      if (!quizQuestions.isError) {
        const ques = quizQuestions.data.map((q) => {
          return {
            questionText: q.quizQuestionText,
            options: q.qoptions.map((o) => o.optionText),
            answer: q.answer.optionText,
          }
        });
        setQuestions(ques);
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
    if (currentQuizId > 0) {
      // Save quiz to API
      const reqData = {
        quizId: currentQuizId,
        quizName: quizTitle,
        quizDescription: quizTitle,
        quizDueDate: quizDueDate.format('YYYY-MM-DDTHH:mm:ss'),
        totalMarks: quizTotalMarks,
        quizWeightage: 0.0,
        questions: questions,
        isActive: true,
        updatedBy: session?.userDetails?.userId,
      }

      const res = await editQuiz(reqData, session["id_token"]);
      if (!res.isError) {
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
    } else {
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

    }
    fetchAllQuizzes();
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
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
  }

  const handleActiveQuiz = async (quizId) => {
    const res = await activeQuiz(quizId, session["id_token"]);
    if (!res.isError) {
      fetchAllQuizzes();
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
  }

  return (
    <QuizCreationContainer>
      <TitleSection>
        <QuizHeader variant="h4">Quiz Creation</QuizHeader>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create New Quiz
        </Button>
      </TitleSection>

      <QuizList>
        {quizzes.map((quiz) => (
          <QuizListItem key={quiz.quizId}>
            <ListItemText
              primary={quiz.quizName}
              secondary={`Due: ${dayjs(quiz.quizDueDate).format('DD-MM-YYYY hh:mm A')} | Total Marks: ${quiz.totalMarks}`}
            />
            <IconButton disabled={!quiz.active} onClick={() => handleOpenDialog(quiz)}>
              <EditIcon />
            </IconButton>
            <IconButton disabled={!quiz.active} onClick={() => handleDeleteQuiz(quiz.quizId)}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => handleActiveQuiz(quiz.quizId)}>
              {
                quiz.active ? <VisibilityIcon titleAccess="Make Inactive" /> : <VisibilityOffIcon titleAccess="Make Active" />
              }
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
          {loading ? <CircularProgress /> : <>
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
            <Box display="flex" alignItems="center">
              <Typography variant="h6">Questions</Typography>
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                id="pdf-upload"
                onChange={handleFileUpload}
              />
              <label htmlFor="pdf-upload">
                <UploadButton
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                >
                  Generate from PDF
                </UploadButton>
              </label>
            </Box>
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
          </>}
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
