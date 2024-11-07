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
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Quiz as QuizIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import QuizCreationPage from './quizCreation';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchQuizByInstructId, fetchStudentQuizQuestions, submitQuiz } from '../../../services/quizService';
import dayjs from 'dayjs';
import { EmptyStateContainer } from '../../../../components/EmptyState/EmptyState';

const QuizContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  //marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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

const QuizItem = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: "10",
  },
}));

const QuizPage = () => {
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openQuiz, setOpenQuiz] = useState(null);
  const [submission, setSubmission] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const searchParams = useSearchParams();
  const instructId = searchParams.get('id');
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchQuizzes = async () => {
    if (session?.userDetails?.role !== 'professor') {
      try {
        // Simulating API call
        const res = await fetchQuizByInstructId(instructId, session?.userDetails?.userId, session["id_token"]);
        if (!res.isError) {
          setQuizzes(res.data);
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
          message: "Error while fetching quizzes.",
          severity: 'error',
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (instructId > 0) {
      fetchQuizzes();
    } else {
      router.push('/');
    }
  }, []);


  const handleTakeQuiz = async (quiz) => {
    //fetch quiz questions
    const res = await fetchStudentQuizQuestions(quiz.quiz.quizId, session["id_token"]);
    if (!res.isError) {
      quiz.questions = res.data;
      setOpenQuiz(quiz);
      setCurrentQuestion(0);
      setSelectedAnswer('');
      setSubmission([]);
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
  };

  const handleCloseQuiz = () => {
    setOpenQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setSubmission([]);
  };

  const handleAnswerChange = (questionId, optionId) => {
    setSelectedAnswer(optionId);
    const existingSubmission = submission.filter(item => item.questionId == questionId);
    if (existingSubmission.length == 0) {
      setSubmission([...submission, { questionId: questionId, optionId: optionId }]);
    } else {
      setSubmission(submission.map(item => item.questionId == questionId ? { ...item, optionId: optionId } : item));
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < openQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // Quiz completed
      const reqData = {
        quizId: openQuiz.quiz.quizId,
        submission: submission,
        userId: session?.userDetails?.userId
      }
      const res = await submitQuiz(reqData, session["id_token"]);
      if (!res.isError) {
        fetchQuizzes();
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
      handleCloseQuiz();
    }
  };

  const isQuizAvailable = (quiz) => {
    return !quiz.submitted && dayjs(quiz.quiz.quizDueDate) > dayjs();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (session?.userDetails?.role === 'professor') {
    return <QuizCreationPage />;
  }

  return (
    <QuizContainer>
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Available Quizzes
        </Typography>
      </TitleSection>
      {quizzes.length > 0 ? <List>
        {quizzes.map((quiz, index) => (
          <React.Fragment key={quiz.quiz.quizId}>
            <QuizItem>
              <ListItemText
                primary={<QuizTitle>{quiz.quiz.quizName}</QuizTitle>}
                secondary={
                  <React.Fragment>
                    <QuizDetails>
                      Due Date: {dayjs(quiz.quiz.quizDueDate).format('DD-MM-YYYY HH:mm A')}
                    </QuizDetails>
                    <QuizDetails>
                      Total Marks: {quiz.quiz.totalMarks}
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
            </QuizItem>
          </React.Fragment>
        ))}
      </List> :
        <EmptyStateContainer>
          <QuizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Quizzes Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 450 }}>
            Start engaging with your students by creating your first course announcement.
          </Typography>
        </EmptyStateContainer>}
      {openQuiz && (
        <QuizDialog
          open={!!openQuiz}
          onClose={handleCloseQuiz}
          aria-labelledby="quiz-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <QuizDialogTitle id="quiz-dialog-title">
            <Typography variant="h6">{openQuiz.quizName}</Typography>
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
              {openQuiz.questions[currentQuestion].quizQuestionText}
            </QuizQuestion>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={selectedAnswer}
                onChange={(event) => { handleAnswerChange(openQuiz.questions[currentQuestion].questionId, parseInt(event.target.value)) }}
              >
                {openQuiz.questions[currentQuestion].qoptions.map((option, index) => (
                  <QuizOption
                    key={option.optionId}
                    value={option.optionId}
                    control={<Radio />}
                    label={option.optionText}
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
    </QuizContainer>
  );
};

export default QuizPage;
