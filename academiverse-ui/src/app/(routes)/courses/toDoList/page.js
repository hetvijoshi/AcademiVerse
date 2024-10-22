'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { CheckCircle as DoneIcon } from '@mui/icons-material';

const TodoCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  width: '98%',  // Decreased width to move card to the left
  margin: '0 auto 0 0',  // Adjusted margin to align to the left
  height: '80px',  // Decreased height
}));

const TodoContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px',  // Decreased padding
});

const TodoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),  // Decreased gap
}));

const TodoItem = styled(Box)(({ theme }) => ({
  width: '100%',
}));

const TitleSection = styled(Box)(({ theme }) => ({
  height: '10vh',  // Decreased height
  width: '100%',
  background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',  // Changed gradient colors
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: theme.spacing(0, 4),
}));

const ContentSection = styled(Box)(({ theme }) => ({
  height: '90vh',  // Increased height to compensate for smaller title section
  width: '100%',
  padding: theme.spacing(3),
  overflowY: 'auto',
}));

const ToDoListScreen = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await new Promise(resolve => 
          setTimeout(() => resolve([
            { id: 1, name: 'Complete Project Proposal', dueDate: '2023-06-30T23:59', course: 'Introduction to Computer Science' },
            { id: 2, name: 'Submit Research Paper', dueDate: '2023-07-15T18:00', course: 'Data Structures and Algorithms' },
            { id: 3, name: 'Prepare Presentation', dueDate: '2023-07-05T14:30', course: 'Web Development Fundamentals' },
          ]), 1000)
        );
        setTodos(response.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleDoneClick = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <TitleSection>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          Task Tracker
        </Typography>
      </TitleSection>
      <ContentSection>
        {loading ? (
          <CircularProgress />
        ) : (
          <TodoContainer>
            {todos.map((todo) => (
              <TodoItem key={todo.id}>
                <TodoCard elevation={2}>
                  <TodoContent>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" component="div">
                        {todo.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {todo.course} | Due: {formatDateTime(todo.dueDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleDoneClick(todo.id)} size="small">
                        <DoneIcon color="primary" />
                      </IconButton>
                    </Box>
                  </TodoContent>
                </TodoCard>
              </TodoItem>
            ))}
          </TodoContainer>
        )}
      </ContentSection>
    </Box>
  );
};

export default ToDoListScreen;
