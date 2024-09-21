'use client';

import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, IconButton, Button,
  Avatar, Chip, Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import { Alarm as ReminderIcon, Flag as FlagIcon, Comment as CommentIcon } from '@mui/icons-material';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto',
}));

const AnnouncementCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': { 
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const AnnouncementContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
});

const TitleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const AnnouncementsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
}));

const AnnouncementItem = styled(Box)(({ theme }) => ({
  flexBasis: 'calc(33.333% - 16px)',
  [theme.breakpoints.down('md')]: {
    flexBasis: 'calc(50% - 16px)',
  },
  [theme.breakpoints.down('sm')]: {
    flexBasis: '100%',
  },
}));

const announcements = [
  {
    id: 1,
    title: 'Midterm Exam Date Announced',
    content: 'The midterm exam will be held on October 15th. Please review chapters 1-5.',
    date: '2023-09-30',
    author: 'Prof. Johnson',
    avatar: '/path-to-avatar1.jpg',
    comments: 5,
    important: true,
  },
  {
    id: 2,
    title: 'Guest Lecture Next Week',
    content: 'We will have a guest lecture by Dr. Jane Smith on AI Ethics on October 5th.',
    date: '2023-10-01',
    author: 'Dr. Williams',
    avatar: '/path-to-avatar2.jpg',
    comments: 3,
    important: false,
  },
  {
    id: 3,
    title: 'Project Deadline Extended',
    content: 'The deadline for submitting your group projects has been extended to November 10th.',
    date: '2023-10-03',
    author: 'Prof. Davis',
    avatar: '/path-to-avatar3.jpg',
    comments: 8,
    important: true,
  },
];

const AnnouncementPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <PageContainer>
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">Course Announcements</Typography>
        <Button variant="contained" color="primary" startIcon={<CommentIcon />}>
          New Announcement
        </Button>
      </TitleSection>
      <AnnouncementsContainer>
        {announcements.map((announcement) => (
          <AnnouncementItem key={announcement.id}>
            <AnnouncementCard 
              onMouseEnter={() => setHoveredCard(announcement.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <AnnouncementContent>
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom color="primary">{announcement.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {announcement.content}
                  </Typography>
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={announcement.avatar} alt={announcement.author} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="subtitle2">{announcement.author}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {announcement.date}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label={`${announcement.comments} comments`}
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Box>
                      <Tooltip title="Set reminder">
                        <IconButton size="small" color={hoveredCard === announcement.id ? "primary" : "default"}>
                          <ReminderIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={announcement.important ? "Important" : "Mark as important"}>
                        <IconButton size="small" color={announcement.important ? "error" : "default"}>
                          <FlagIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </AnnouncementContent>
            </AnnouncementCard>
          </AnnouncementItem>
        ))}
      </AnnouncementsContainer>
    </PageContainer>
  );
};

export default AnnouncementPage;
