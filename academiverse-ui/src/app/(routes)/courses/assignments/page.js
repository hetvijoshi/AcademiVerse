'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, List, Paper, Chip, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import AssignmentCreationPage from './assignmentCreation';
import { getActiveAssignmentsByInstructId, getAssignmentsByInstructId } from '../../../services/assignmentService';
import dayjs from 'dayjs';

const AssignmentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  backgroundColor: '#f5f5f5',
}));

const AssignmentItem = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: "10",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const router = useRouter();
  const instructId = useSearchParams().get('id');
  const { data: session } = useSession();

  const fetchAssignments = async () => {
    const res = await getActiveAssignmentsByInstructId(instructId, session.id_token);
    if (!res.isError) {
      const formattedData = res.data.map((assignment) => ({
        id: assignment.assignmentId,
        title: assignment.assignmentTitle,
        description: assignment.assignmentDescription,
        dueDate: assignment.assignmentDueDate,
        totalMarks: assignment.totalMarks
      }));
      setAssignments(formattedData);
    } else {
      setSnackbarMessage(res.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    // Fetch assignments from API


    fetchAssignments();
  }, []);

  const handleAssignmentClick = (assignmentId) => {
    router.push(`/courses?id=${instructId}&section=assignmentDetail&assignmentId=${assignmentId}`);
  };

  if (session?.userDetails?.role === 'professor') {
    return <AssignmentCreationPage />;
  }

  return (
    <AssignmentContainer>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <AssignmentIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
        Assignments
      </Typography>
      <List>
        {assignments.map((assignment) => (
          <AssignmentItem
            key={assignment.id}
            onClick={() => handleAssignmentClick(assignment.id)}
            elevation={2}
          >
            <Typography variant="h6" color="primary">
              {assignment.title}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <StyledChip label={`Due: ${dayjs(assignment.dueDate).format('DD-MM-YYYY HH:mm A')}`} color="primary" variant="outlined" size="small" />
              <StyledChip label={`Total marks: ${assignment.totalMarks}`} color="secondary" variant="outlined" size="small" />
            </Box>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{ mt: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAssignmentClick(assignment.id);
              }}
            >
              View Details
            </Button>
          </AssignmentItem>
        ))}
      </List>
    </AssignmentContainer>
  );
};

export default AssignmentPage;
