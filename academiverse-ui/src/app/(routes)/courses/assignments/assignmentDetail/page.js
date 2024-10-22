'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Assignment as AssignmentIcon, CloudUpload as CloudUploadIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation';

const DetailContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  backgroundColor: '#f5f5f5',
}));

const DetailPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const AssignmentDetail = () => {
  const [file, setFile] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignmentId');
  const courseId = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    // Fetch assignments from API
    const fetchAssignment = async (assignmentId) => {
      // Replace with actual API call
      const mockAssignments = [
        { id: 1, title: 'Assignment 1', dueDate: '2023-06-30', description: `Dear all, Each team is required to upload a single project proposal for their group.  This proposal should outline your project's goals, methodology, timeline, and expected outcomes, resource allocation, cost estimation,.... You can get help from provided template to guide your proposal, and ensure that you include comprehensive documentation for the planning phase. Be thorough in detailing your plan, as this will serve as a foundation for the successful completion of your project. Remember, clear and complete documentation is key to a well-organized project.`, totalMarks: 10, marksObtained: 8 },
        { id: 2, title: 'Assignment 2', dueDate: '2023-07-15', description: 'Write a report on data structures.', totalMarks: 15, marksObtained: 12 },
        { id: 3, title: 'Assignment 3', dueDate: '2023-07-31', description: 'Develop a small web application.', totalMarks: 20, marksObtained: 18 },
      ];
      setAssignment(mockAssignments.find(a => a.id === parseInt(assignmentId)));
    };

    fetchAssignment(assignmentId);
  }, [assignmentId]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    // Simulating file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    setFile(null);
    // Here you would typically send the file to your server
    console.log('File uploaded:', file.name);
  };

  const handleBack = () => {
    router.push(`/courses?id=${courseId}&section=assignments`);
  };

  if (!assignment) {
    return <Typography>Assignment not found</Typography>;
  }

  return (
    <DetailContainer>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ marginBottom: 2 }}
      >
        Back to Assignments
      </Button>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <AssignmentIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
        {assignment.title}
      </Typography>
      
      <DetailPaper elevation={3}>
        <Typography variant="h6" color="primary" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" gutterBottom>
          {assignment.description}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <StyledChip label={`Due: ${assignment.dueDate}`} color="primary" variant="outlined" />
          <StyledChip label={`Total Marks: ${assignment.totalMarks}`} color="secondary" variant="outlined" />
          <StyledChip label={`Marks Obtained: ${assignment.marksObtained}`} color="success" variant="outlined" />
        </Box>
        
        <Typography variant="h6" color="primary" gutterBottom>
          Submit Assignment
        </Typography>
        <TextField
          type="file"
          onChange={handleFileChange}
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <CloudUploadIcon color="action" />
            ),
          }}
        />
        <UploadButton
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        >
          {uploading ? 'Uploading...' : 'Upload Assignment'}
        </UploadButton>
      </DetailPaper>
    </DetailContainer>
  );
};

export default AssignmentDetail;
