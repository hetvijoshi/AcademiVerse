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
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

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
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDueDate, setQuizDueDate] = useState(dayjs());
  const [quizTotalMarks, setQuizTotalMarks] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionMarks, setQuestionMarks] = useState('');

  useEffect(() => {
    // Fetch quizzes from API
    // This is a mock implementation
    setQuizzes([
      { id: 1, title: 'Midterm Quiz', dueDate: '2023-07-15T23:59:59', totalMarks: 100 },
      { id: 2, title: 'Final Quiz', dueDate: '2023-08-30T23:59:59', totalMarks: 150 },
    ]);
  }, []);

  const handleOpenDialog = (quiz = null) => {
    setCurrentQuiz(quiz);
    if (quiz) {
      setQuizTitle(quiz.title);
      setQuizDueDate(dayjs(quiz.dueDate));
      setQuizTotalMarks(quiz.totalMarks.toString());
      // Fetch questions for this quiz
      // For now, let's add some mock questions
      setQuestions([
        { question: "What is 2+2?", options: ["3", "4", "5", "6"], correctAnswer: "4", marks: 5 },
        { question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correctAnswer: "Paris", marks: 5 },
      ]);
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
    setCurrentQuiz(null);
  };

  const handleSaveQuiz = () => {
    // Save quiz to API
    console.log('Saving quiz:', { quizTitle, quizDueDate, quizTotalMarks, questions });
    handleCloseDialog();
  };

  const handleAddQuestion = () => {
    if (currentQuestion && options.every(option => option !== '') && correctAnswer && questionMarks) {
      setQuestions([...questions, { question: currentQuestion, options, correctAnswer, marks: questionMarks }]);
      setCurrentQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      setQuestionMarks('');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setCurrentQuestion(questionToEdit.question);
    setOptions(questionToEdit.options);
    setCorrectAnswer(questionToEdit.correctAnswer);
    setQuestionMarks(questionToEdit.marks.toString());
    // Remove the question from the list
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

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
          <QuizListItem key={quiz.id}>
            <ListItemText
              primary={quiz.title}
              secondary={`Due: ${new Date(quiz.dueDate).toLocaleString()} | Total Marks: ${quiz.totalMarks}`}
            />
            <IconButton onClick={() => handleOpenDialog(quiz)}>
              <EditIcon />
            </IconButton>
            <IconButton>
              <DeleteIcon />
            </IconButton>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </QuizListItem>
        ))}
      </QuizList>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
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
              <Typography variant="subtitle1">{q.question}</Typography>
              <Typography variant="body2">Options: {q.options.join(', ')}</Typography>
              <Typography variant="body2">Correct Answer: {q.correctAnswer}</Typography>
              <Typography variant="body2">Marks: {q.marks}</Typography>
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
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              label="Correct Answer"
            >
              {options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <StyledTextField
            margin="dense"
            label="Question Marks"
            type="number"
            fullWidth
            value={questionMarks}
            onChange={(e) => setQuestionMarks(e.target.value)}
          />
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
