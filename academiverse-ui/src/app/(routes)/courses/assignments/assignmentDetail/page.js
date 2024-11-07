'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { Assignment as AssignmentIcon, CloudUpload as CloudUploadIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAssignmentById, submitAssignment } from '../../../../services/assignmentService';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import { uploadDocument } from '../../../../services/genericService';

const DetailContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchAssignment = async (assignmentId) => {
    // Replace with actual API call
    const reqData = {
      assignmentId: assignmentId,
      userId: session.userDetails?.userId,
    }
    const res = await getAssignmentById(reqData, session.id_token);
    if (!res.isError) {
      const formattedData = {
        id: res.data?.assignment.assignmentId,
        title: res.data?.assignment.assignmentTitle,
        description: res.data?.assignment.assignmentDescription,
        dueDate: res.data?.assignment.assignmentDueDate,
        totalMarks: res.data?.assignment.totalMarks,
        assignmentSubmission: res.data?.assignmentSubmission
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
    const formData = new FormData();
    formData.append('file', file);
    const res1 = await uploadDocument(formData, session.id_token);
    if(!res1.isError) {
      setFile(null);
      const reqData = {
        userId: session?.userDetails?.userId,
        assignmentId: assignmentId,
        assignmentLink: res1.data,
        createdBy: session?.userDetails?.userId,
        updatedBy: session?.userDetails?.userId
      }
      const res = await submitAssignment(reqData, session.id_token);
      if (!res.isError) {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'success',
        });
        handleBack();
      } else {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'error',
        });
      }
    }
    else {
      setSnackbar({
        open: true,
        message: res1.message,
        severity: 'error',
      });
    }
    setUploading(false); 
    // Here you would typically send the file to your server
    console.log('File uploaded:', file.name);
  };

  const handleBack = () => {
    router.push(`/courses?id=${courseId}&section=assignments`);
  };

  if (!assignment) {
    return <Typography>Assignment not found</Typography>;
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <DetailContainer>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ marginBottom: 2 }}
      >
        Back to Assignments
      </Button>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        <AssignmentIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
        {assignment.title}
      </Typography>

      <DetailPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
          {assignment.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <StyledChip label={`Due: ${dayjs(assignment.dueDate).format('DD-MM-YYYY hh:mm A')}`} color="primary" variant="outlined" />
          <StyledChip label={`Total Marks: ${assignment.totalMarks}`} color="secondary" variant="outlined" />
        </Box>

        <Typography variant="h6" gutterBottom>
          {assignment.assignmentSubmission ? 'Last Submission' : 'No submission'}
        </Typography>
        
        {assignment.assignmentSubmission && (
          <Box sx={{ mb: 3 }}>
            <iframe 
              src={assignment.assignmentSubmission.assignmentLink}
              width="100%"
              height="500px"
              style={{ border: 'none' }}
              title="Assignment Submission"
            />
          </Box>
        )}

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
    </DetailContainer>
  );
};

export default AssignmentDetail;
