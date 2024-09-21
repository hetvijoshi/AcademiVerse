'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { Alarm as ReminderIcon, Flag as FlagIcon } from '@mui/icons-material';

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
  height: '15vh',
  width: '100%',
  background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: theme.spacing(0, 4),
}));

const ContentSection = styled(Box)(({ theme }) => ({
  height: '85vh',
  width: '100%',
  padding: theme.spacing(3),
  overflowY: 'auto',
}));

const ToDoListScreen = () => {
  const [todos, setTodos] = useState([]);
  const [openReminder, setOpenReminder] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [reminderTime, setReminderTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await new Promise(resolve => 
          setTimeout(() => resolve([
            { id: 1, name: 'Complete Project Proposal', dueDate: '2023-06-30T23:59', priority: false, course: 'Introduction to Computer Science' },
            { id: 2, name: 'Submit Research Paper', dueDate: '2023-07-15T18:00', priority: true, course: 'Data Structures and Algorithms' },
            { id: 3, name: 'Prepare Presentation', dueDate: '2023-07-05T14:30', priority: false, course: 'Web Development Fundamentals' },
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

  const handleReminderClick = (todo) => {
    setSelectedTodo(todo);
    setOpenReminder(true);
  };

  const handleCloseReminder = () => {
    setOpenReminder(false);
    setSelectedTodo(null);
    setReminderTime('');
  };

  const handleSetReminder = () => {
    console.log(`Reminder set for ${selectedTodo.name} at ${reminderTime}`);
    handleCloseReminder();
  };

  const handleTogglePriority = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, priority: !todo.priority } : todo
    ));
  };

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <TitleSection>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          My To-Do List
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
                      <IconButton onClick={() => handleReminderClick(todo)} size="small">
                        <ReminderIcon />
                      </IconButton>
                      <IconButton onClick={() => handleTogglePriority(todo.id)} size="small">
                        <FlagIcon color={todo.priority ? 'error' : 'action'} />
                      </IconButton>
                    </Box>
                  </TodoContent>
                </TodoCard>
              </TodoItem>
            ))}
          </TodoContainer>
        )}
        <Dialog open={openReminder} onClose={handleCloseReminder}>
          <DialogTitle>Set Reminder</DialogTitle>
          <DialogContent>
            <TextField
              label="Reminder Time"
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReminder}>Cancel</Button>
            <Button onClick={handleSetReminder} variant="contained" color="primary">
              Set Reminder
            </Button>
          </DialogActions>
        </Dialog>
      </ContentSection>
    </Box>
  );
};

export default ToDoListScreen;
