'use client';

import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button,
  Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';
import { Comment as CommentIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';

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
    cursor: 'pointer'
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
  },
  {
    id: 2,
    title: 'Guest Lecture Next Week',
    content: 'We will have a guest lecture by Dr. Jane Smith on AI Ethics on October 5th.',
    date: '2023-10-01',
    author: 'Dr. Williams',
    avatar: '/path-to-avatar2.jpg',
  },
  {
    id: 3,
    title: 'Project Deadline Extended',
    content: 'The deadline for submitting your group projects has been extended to November 10th.',
    date: '2023-10-03',
    author: 'Prof. Davis',
    avatar: '/path-to-avatar3.jpg',
  },
];

const AnnouncementPage = () => {
  const { data: session } = useSession();
  const isProfessor = session?.userDetails?.role === 'professor';
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isNewAnnouncementDialogOpen, setIsNewAnnouncementDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseDialog = () => {
    setSelectedAnnouncement(null);
  };

  const handleOpenNewAnnouncementDialog = () => {
    setIsNewAnnouncementDialogOpen(true);
  };

  const handleCloseNewAnnouncementDialog = () => {
    setIsNewAnnouncementDialogOpen(false);
    setNewAnnouncement({ title: '', content: '' });
  };

  const handleNewAnnouncementChange = (event) => {
    const { name, value } = event.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewAnnouncement = () => {
    // Here you would typically send the new announcement to your backend
    const announcementWithAuthor = {
      ...newAnnouncement,
      author: session?.userDetails?.name || 'Unknown Professor',
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      avatar: session?.userDetails?.image || '/path-to-default-avatar.jpg'
    };
    console.log('New announcement:', announcementWithAuthor);
    handleCloseNewAnnouncementDialog();
  };

  return (
    <PageContainer>
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">Course Announcements</Typography>
        {isProfessor && (
          <Button variant="contained" color="primary" startIcon={<CommentIcon />} onClick={handleOpenNewAnnouncementDialog}>
            New Announcement
          </Button>
        )}
      </TitleSection>
      <AnnouncementsContainer>
        {announcements.map((announcement) => (
          <AnnouncementItem key={announcement.id}>
            <AnnouncementCard onClick={() => handleAnnouncementClick(announcement)}>
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
                </Box>
              </AnnouncementContent>
            </AnnouncementCard>
          </AnnouncementItem>
        ))}
      </AnnouncementsContainer>
      <Dialog open={!!selectedAnnouncement} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedAnnouncement && (
          <>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold">
                {selectedAnnouncement.title}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedAnnouncement.content}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <Avatar src={selectedAnnouncement.avatar} alt={selectedAnnouncement.author} sx={{ width: 32, height: 32, mr: 1 }} />
                  <Typography variant="subtitle1">{selectedAnnouncement.author}</Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {selectedAnnouncement.date}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Dialog open={isNewAnnouncementDialogOpen} onClose={handleCloseNewAnnouncementDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            New Announcement
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Announcement Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newAnnouncement.title}
            onChange={handleNewAnnouncementChange}
          />
          <TextField
            margin="dense"
            name="content"
            label="Announcement Content"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newAnnouncement.content}
            onChange={handleNewAnnouncementChange}
          />
          <Box mt={2} display="flex" alignItems="center">
            <Avatar src={session?.userDetails?.image || '/path-to-default-avatar.jpg'} alt={session?.userDetails?.name} sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography variant="subtitle1">{session?.userDetails?.name || 'Unknown Professor'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewAnnouncementDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitNewAnnouncement} color="primary" variant="contained">
            Post Announcement
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AnnouncementPage;
