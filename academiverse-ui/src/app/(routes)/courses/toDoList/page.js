'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import { CheckCircle as DoneIcon } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getUserTodos, markCompleted } from '../../../services/todoService';
import dayjs from 'dayjs';

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

const TodoContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const TodoContainer2 = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),  // Decreased gap
}));

const TodoItem = styled(Box)(({ theme }) => ({
  width: '100%',
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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
  const router = useRouter();
  const instructId = useSearchParams().get('id');
  const { data: session } = useSession();

  const fetchTodos = async () => {
    try {
      const res = await getUserTodos(instructId, session.userDetails?.userId, session.id_token);
      if (!res.isError) {
        setTodos(res.data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDoneClick = async (id) => {
    setLoading(true);
    if (id > 0) {
      const res = await markCompleted(id, session.id_token);
      if (!res.isError) {
        fetchTodos();
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <TodoContainer sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Task Tracker
        </Typography>
      </TitleSection>
      <ContentSection>
        {loading ? (
          <CircularProgress />
        ) : (
          <TodoContainer2>
            {todos != null && todos.length <= 0 ? (<Typography variant="h6" color="text.secondary">
              No todos
            </Typography>) : todos.map((todo) => (
              <TodoItem key={todo.toDoId}>
                <TodoCard elevation={2}>
                  <TodoContent>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" component="div">
                        {todo.toDoTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {todo.instruct.course.courseName} | Due: {dayjs(todo.toDoDueDate).format('YYYY-MM-DD hh:mm A')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleDoneClick(todo.toDoId)} size="small">
                        <DoneIcon color="primary" />
                      </IconButton>
                    </Box>
                  </TodoContent>
                </TodoCard>
              </TodoItem>
            ))}
          </TodoContainer2>
        )}
      </ContentSection>
    </TodoContainer>
  );
};

export default ToDoListScreen;
