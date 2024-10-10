'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, List, Paper, Chip, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { Assignment as AssignmentIcon } from '@mui/icons-material';

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

const AssignmentPage = ({ course }) => {
  const [assignments, setAssignments] = useState([]);
  const router = useRouter();
  const courseId = useSearchParams().get('id');

  useEffect(() => {
    // Fetch assignments from API
    const fetchAssignments = async () => {
      // Replace with actual API call
      const mockAssignments = [
        { id: 1, title: 'Assignment 1', dueDate: '2023-06-30', description: `Dear all, Each team is required to upload a single project proposal for their group.  This proposal should outline your project’s goals, methodology, timeline, and expected outcomes, resource allocation, cost estimation,.... You can get help from provided template to guide your proposal, and ensure that you include comprehensive documentation for the planning phase. Be thorough in detailing your plan, as this will serve as a foundation for the successful completion of your project. Remember, clear and complete documentation is key to a well-organized project.`, totalMarks: 10, marksObtained: 8 },
        { id: 2, title: 'Assignment 2', dueDate: '2023-07-15', description: 'Write a report on data structures.', totalMarks: 15, marksObtained: 12 },
        { id: 3, title: 'Assignment 3', dueDate: '2023-07-31', description: 'Develop a small web application.', totalMarks: 20, marksObtained: 18 },
      ];
      setAssignments(mockAssignments);
    };

    fetchAssignments();
  }, []);

  const handleAssignmentClick = (assignmentId) => {
    router.push(`/courses?id=${courseId}&section=assignmentDetail&assignmentId=${assignmentId}`);
  };

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
              <StyledChip label={`Due: ${assignment.dueDate}`} color="primary" variant="outlined" size="small" />
              <StyledChip label={`Grade: ${assignment.marksObtained}/${assignment.totalMarks}`} color="secondary" variant="outlined" size="small" />
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
