'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  CircularProgress,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getInstructStudents } from '../../../services/enrollService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { EmptyStateContainer } from '../../../../components/EmptyState/EmptyState';
import GroupIcon from '@mui/icons-material/Group';

const ClassmateContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  //marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginRight: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
  },
}));


const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ClassmatePage = () => {
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const instructId = useSearchParams().get('id');
  const { data: session } = useSession();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchClassmates = async () => {
    try {
      const res = await getInstructStudents(instructId, session.id_token);
      if (!res.isError) {
        setClassmates(res.data);
      } else {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'error',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classmate data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instructId > 0) {
      fetchClassmates();
    } else {
      router.push('/');
    }
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ClassmateContainer>
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Your Classmates
        </Typography>
      </TitleSection>
      {classmates.length > 0 ? (
        <List>
          {classmates.map((classmate, index) => (
            <React.Fragment key={classmate.user.userId}>
              <StyledListItem>
                <ListItemAvatar>
                  <StyledAvatar alt={classmate.user.name} />
                </ListItemAvatar>
                <StyledListItemText primary={classmate.user.name} />
              </StyledListItem>
              {index < classmates.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <EmptyStateContainer>
          <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Classmates Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 450 }}>
            You are currently the only student enrolled in this course. As more students join, they will appear here.
          </Typography>
        </EmptyStateContainer>
      )}
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
    </ClassmateContainer>
  );
};

export default ClassmatePage;
