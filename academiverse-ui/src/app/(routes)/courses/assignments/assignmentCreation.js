'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, List, ListItem, ListItemText, IconButton, Switch, Paper, Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const AssignmentItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AssignmentCreationPage = () => {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: dayjs(),
    totalMarks: 0,
  });
  const [editAssignment, setEditAssignment] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  useEffect(() => {
    // Fetch assignments from API
    // This is a placeholder. Replace with actual API call.
    setAssignments([
      { id: 1, title: 'Assignment 1', description: 'Description 1', dueDate: dayjs(), totalMarks: 100, isActive: true },
      { id: 2, title: 'Assignment 2', description: 'Description 2', dueDate: dayjs(), totalMarks: 50, isActive: false },
    ]);
  }, []);

  const handleCreateAssignment = () => {
    // Add new assignment to the list
    // This is a placeholder. Replace with actual API call.
    setAssignments([...assignments, { ...newAssignment, id: Date.now(), isActive: true }]);
    setOpenDialog(false);
    setNewAssignment({ title: '', description: '', dueDate: dayjs(), totalMarks: 0 });
    setSnackbarMessage('Assignment created successfully!');
    setSnackbarOpen(true);
  };

  const handleToggleAssignment = (id) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, isActive: !assignment.isActive } : assignment
    ));
  };

  const handleEditAssignment = (id) => {
    // Open edit dialog
    setEditAssignment(assignments.find(assignment => assignment.id === id));
    setEditDialogOpen(true);
  };

  const handleEditSaveAssignment = () => {
    //API call for edit assignment
    setEditDialogOpen(false);
    setEditAssignment(null);
    setSnackbarMessage('Assignment edited successfully!');
    setSnackbarOpen(true);
  }

  const handleDeleteAssignment = (id) => {
    setAssignmentToDelete(assignments.find(assignment => assignment.id === id));
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Implement delete functionality
    setAssignments(assignments.filter(assignment => assignment.id !== assignmentToDelete.id));
    setDeleteDialogOpen(false);
    setAssignmentToDelete(null);
    setSnackbarMessage('Assignment deleted successfully!');
    setSnackbarOpen(true);
  };

  if (session?.userDetails?.role !== 'professor') {
    return <Typography>Access Denied. Only professors can view this page.</Typography>;
  }

  return (
    <PageContainer>
      <TitleSection>
        <Typography variant="h4">Assignments</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Assignment
        </Button>
      </TitleSection>

      <List>
        {assignments.map((assignment) => (
          <AssignmentItem key={assignment.id}>
            <ListItemText
              primary={assignment.title}
              secondary={`Due: ${assignment.dueDate.format('YYYY-MM-DD HH:mm:ss')} | Marks: ${assignment.totalMarks}`}
            />
            <Switch
              checked={assignment.isActive}
              onChange={() => handleToggleAssignment(assignment.id)}
            />
            <IconButton onClick={() => handleEditAssignment(assignment.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteAssignment(assignment.id)}>
              <DeleteIcon />
            </IconButton>
          </AssignmentItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Assignment</DialogTitle>
        <StyledDialogContent>
          <Box mt={2}>
            <Box mb={2}>
              <StyledTextField
                autoFocus
                label="Assignment Title"
                fullWidth
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              />
            </Box>
            <Box mb={2}>
              <StyledTextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              />
            </Box>
            <Box mb={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Due Date"
                  value={newAssignment.dueDate}
                  onChange={(newValue) => setNewAssignment({ ...newAssignment, dueDate: newValue })}
                  renderInput={(params) => <StyledTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Box>
            <Box mb={2}>
              <StyledTextField
                label="Total Marks"
                type="number"
                fullWidth
                value={newAssignment.totalMarks}
                onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: parseInt(e.target.value) })}
              />
            </Box>
          </Box>
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAssignment} variant="contained" color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Assignment</DialogTitle>
        <StyledDialogContent>
          <Box mt={2}>
            <Box mb={2}>
              <StyledTextField
                autoFocus
                label="Assignment Title"
                fullWidth
                value={editAssignment?.title}
                onChange={(e) => setEditAssignment({ ...editAssignment, title: e.target.value })}
              />
            </Box>
            <Box mb={2}>
              <StyledTextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={editAssignment?.description}
                onChange={(e) => setEditAssignment({ ...editAssignment, description: e.target.value })}
              />
            </Box>
            <Box mb={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Due Date"
                  value={editAssignment?.dueDate}
                  onChange={(newValue) => setEditAssignment({ ...editAssignment, dueDate: newValue })}
                  renderInput={(params) => <StyledTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Box>
            <Box mb={2}>
              <StyledTextField
                label="Total Marks"
                type="number"
                fullWidth
                value={editAssignment?.totalMarks}
                onChange={(e) => setEditAssignment({ ...editAssignment, totalMarks: parseInt(e.target.value) })}
              />
            </Box>
          </Box>
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSaveAssignment} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Assignment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this assignment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default AssignmentCreationPage;
