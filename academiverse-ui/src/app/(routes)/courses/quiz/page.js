'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const QuizContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: '#f5f5f5',
}));

const QuizHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const QuizInfo = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const TakeQuizButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const QuizTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: theme.palette.primary.main,
}));

const QuizDetails = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
}));

const QuizDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
}));

const QuizDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const QuizDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const QuizQuestion = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const QuizOption = styled(FormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const QuizProgress = styled(LinearProgress)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openQuiz, setOpenQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Simulating API call
        const response = await new Promise(resolve =>
          setTimeout(() => resolve([
            {
              id: 1,
              title: 'Midterm Quiz',
              dueDate: '2023-07-15T23:59:59',
              totalMarks: 100,
              submitted: false,
              questions: [
                {
                  question: 'What is the capital of France?',
                  options: ['London', 'Berlin', 'Paris', 'Madrid'],
                  correctAnswer: 'Paris'
                },
                {
                  question: 'Which planet is known as the Red Planet?',
                  options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
                  correctAnswer: 'Mars'
                }
              ]
            },
            {
              id: 2,
              title: 'Final Quiz',
              dueDate: '2023-08-30T23:59:59',
              totalMarks: 150,
              submitted: false,
              questions: [
                {
                  question: 'Who painted the Mona Lisa?',
                  options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Claude Monet'],
                  correctAnswer: 'Leonardo da Vinci'
                },
                {
                  question: 'What is the largest ocean on Earth?',
                  options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
                  correctAnswer: 'Pacific Ocean'
                }
              ]
            },
            {
              id: 3,
              title: 'Chapter 1 Quiz',
              dueDate: '2023-07-05T23:59:59',
              totalMarks: 50,
              submitted: true
            },
            {
              id: 4,
              title: 'Pop Quiz',
              dueDate: '2024-12-10T23:59:59',
              totalMarks: 25,
              submitted: false,
              questions: [
                {
                  question: 'Who painted the Mona Lisa?',
                  options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Claude Monet'],
                  correctAnswer: 'Leonardo da Vinci'
                },
                {
                  question: 'What is the largest ocean on Earth?',
                  options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
                  correctAnswer: 'Pacific Ocean'
                }
              ]
            }
          ]), 1000)
        );
        setQuizzes(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleTakeQuiz = (quiz) => {
    setOpenQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer('');
  };

  const handleCloseQuiz = () => {
    setOpenQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer('');
  };

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < openQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // Quiz completed
      handleCloseQuiz();
      // Here you would typically submit the quiz results
      console.log('Quiz completed');
    }
  };

  const isQuizAvailable = (quiz) => {
    return !quiz.submitted && new Date(quiz.dueDate) > new Date();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <QuizContainer elevation={3}>
      <QuizHeader variant="h4" component="h1">
        Available Quizzes
      </QuizHeader>
      <List>
        {quizzes.map((quiz, index) => (
          <React.Fragment key={quiz.id}>
            {index > 0 && <Divider variant="inset" component="li" />}
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={<QuizTitle>{quiz.title}</QuizTitle>}
                secondary={
                  <React.Fragment>
                    <QuizDetails>
                      Due Date: {formatDate(quiz.dueDate)}
                    </QuizDetails>
                    <QuizDetails>
                      Total Marks: {quiz.totalMarks}
                    </QuizDetails>
                  </React.Fragment>
                }
              />
              <TakeQuizButton
                variant="contained"
                color="primary"
                onClick={() => handleTakeQuiz(quiz)}
                disabled={!isQuizAvailable(quiz)}
              >
                {isQuizAvailable(quiz) ? 'Take Quiz' : (quiz.submitted ? 'Submitted' : 'Expired')}
              </TakeQuizButton>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      {openQuiz && (
        <QuizDialog
          open={!!openQuiz}
          onClose={handleCloseQuiz}
          aria-labelledby="quiz-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <QuizDialogTitle id="quiz-dialog-title">
            <Typography variant="h6">{openQuiz.title}</Typography>
            <Typography variant="subtitle1">
              Question {currentQuestion + 1} of {openQuiz.questions.length}
            </Typography>
          </QuizDialogTitle>
          <QuizDialogContent>
            <QuizProgress
              variant="determinate"
              value={(currentQuestion + 1) / openQuiz.questions.length * 100}
            />
            <QuizQuestion variant="h6">
              {openQuiz.questions[currentQuestion].question}
            </QuizQuestion>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={selectedAnswer}
                onChange={handleAnswerChange}
              >
                {openQuiz.questions[currentQuestion].options.map((option, index) => (
                  <QuizOption
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </QuizDialogContent>
          <DialogActions>
            <Button onClick={handleCloseQuiz} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleNextQuestion}
              color="primary"
              variant="contained"
              disabled={!selectedAnswer}
            >
              {currentQuestion < openQuiz.questions.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </DialogActions>
        </QuizDialog>
      )}
    </QuizContainer>
  );
};

export default QuizPage;
