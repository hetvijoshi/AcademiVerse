'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Assignment as AssignmentIcon, CloudUpload as CloudUploadIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAssignmentById } from '../../../../services/assignmentService';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

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
  const { data: session } = useSession();

  const fetchAssignment = async (assignmentId) => {
    // Replace with actual API call
    const res = await getAssignmentById(assignmentId, session.id_token);
    if (!res.isError) {
      const formattedData = {
        id: res.data?.assignmentId,
        title: res.data?.assignmentTitle,
        description: res.data?.assignmentDescription,
        dueDate: res.data?.assignmentDueDate,
        totalMarks: res.data?.totalMarks
      }
      setAssignment(formattedData);
    } else {
      setSnackbarMessage(res.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {


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
        <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
          {assignment.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <StyledChip label={`Due: ${dayjs(assignment.dueDate).format('DD-MM-YYYY hh:mm A')}`} color="primary" variant="outlined" />
          <StyledChip label={`Total Marks: ${assignment.totalMarks}`} color="secondary" variant="outlined" />
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
