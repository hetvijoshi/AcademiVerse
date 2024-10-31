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
import { getInstructStudents } from '../../../services/enrollService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  const router = useRouter();
  const instructId = useSearchParams().get('id');
  const { data: session } = useSession();

  const fetchClassmates = async () => {
    try {
      const res = await getInstructStudents(instructId, session.id_token);
      if (!res.isError) {
        setClassmates(res.data);
      } else {

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

  return (
    <ClassmateContainer elevation={3}>
      <ClassmateHeader variant="h4" component="h1">
        Your Classmates
      </ClassmateHeader>
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
    </ClassmateContainer>
  );
};

export default ClassmatePage;
