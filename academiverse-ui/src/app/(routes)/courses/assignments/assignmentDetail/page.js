'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Button, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Assignment as AssignmentIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';

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

const AssignmentDetail = ({ assignment }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  if (!assignment) {
    return <Typography>Assignment not found</Typography>;
  }

  return (
    <DetailContainer>
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
