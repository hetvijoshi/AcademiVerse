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
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ClassmateContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
}));

const ClassmateHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '2rem',
  textAlign: 'center',
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

const ClassmatePage = () => {
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassmates = async () => {
      try {
        // Simulating API call
        const response = await new Promise(resolve =>
          setTimeout(() => resolve([
            { id: 1, name: 'John Doe', photoUrl: null },
            { id: 2, name: 'Jane Smith', photoUrl: 'https://example.com/jane.jpg' },
            { id: 3, name: 'Bob Johnson', photoUrl: null },
            { id: 4, name: 'Alice Brown', photoUrl: 'https://example.com/alice.jpg' },
          ]), 1000)
        );
        setClassmates(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classmate data:', error);
        setLoading(false);
      }
    };

    fetchClassmates();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ClassmateContainer elevation={3}>
      <ClassmateHeader variant="h4" component="h1">
        Your Classmates
      </ClassmateHeader>
      <List>
        {classmates.map((classmate, index) => (
          <React.Fragment key={classmate.id}>
            <StyledListItem>
              <ListItemAvatar>
                <StyledAvatar src={classmate.photoUrl || '/path/to/dummy-avatar.png'} alt={classmate.name} />
              </ListItemAvatar>
              <StyledListItemText primary={classmate.name} />
            </StyledListItem>
            {index < classmates.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </ClassmateContainer>
  );
};

export default ClassmatePage;
