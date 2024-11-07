'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button,
  Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import { Comment as CommentIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchInstructAnnouncements, saveAnnouncement } from '../../../services/announcementService';
import { create } from 'domain';
import dayjs from 'dayjs';
import { EmptyStateContainer } from '../../../../components/EmptyState/EmptyState'

const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  //marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const AnnouncementCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    cursor: 'pointer'
  },
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const AnnouncementContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
  overflow: 'auto', // Add scroll for overflow content
});

const TitleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  width: '100%',
}));

const AnnouncementsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
  justifyContent: 'flex-start', // Left align items
}));

const AnnouncementItem = styled(Box)(({ theme }) => ({
  width: 'calc(33.333% - 16px)', // Fixed width with gap consideration
  minWidth: '300px', // Minimum width
  [theme.breakpoints.down('md')]: {
    width: 'calc(50% - 16px)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const AnnouncementPage = () => {
  const { data: session } = useSession();
  const isProfessor = session?.userDetails?.role === 'professor';
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isNewAnnouncementDialogOpen, setIsNewAnnouncementDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [announcements, setAnnouncements] = useState([]);
  const searchParams = useSearchParams();
  const instructId = searchParams.get('id');
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchAllAnnouncements = async () => {
    const res = await fetchInstructAnnouncements(instructId, session["id_token"]);
    if (!res.isError) {
      setAnnouncements(res.data);
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
  };

  const addAnnouncement = async (announcement) => {
    const res = await saveAnnouncement(announcement, session["id_token"]);
    if (!res.isError) {
      fetchAllAnnouncements();
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (instructId > 0) {
      fetchAllAnnouncements();
    } else {
      router.push(`/`);
    }
  }, []);

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
    const reqData = {
      instructId: instructId,
      announcementTitle: newAnnouncement.title,
      announcementDescription: newAnnouncement.content,
      createdBy: session?.userDetails?.userId,
    };
    addAnnouncement(reqData);
    handleCloseNewAnnouncementDialog();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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
        {announcements.length > 0 ? announcements.map((announcement) => (
          <AnnouncementItem key={announcement.announcementId}>
            <AnnouncementCard onClick={() => handleAnnouncementClick(announcement)}>
              <AnnouncementContent>
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom color="primary">{announcement.announcementTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {announcement.announcementDescription}
                  </Typography>
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <Avatar alt={announcement.author.name} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="subtitle2">{announcement.author.name}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(announcement.createdAt).format('DD MMM YYYY')}
                    </Typography>
                  </Box>
                </Box>
              </AnnouncementContent>
            </AnnouncementCard>
          </AnnouncementItem>
        )) : <EmptyStateContainer>
          <CommentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Announcements Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 450 }}>
            {isProfessor
              ? "Start engaging with your students by creating your first course announcement."
              : "There are no announcements for this course yet. Check back later for updates from your professor."}
          </Typography>
        </EmptyStateContainer>}
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
      </AnnouncementsContainer>
      <Dialog open={!!selectedAnnouncement} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedAnnouncement && (
          <>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold">
                {selectedAnnouncement.announcementTitle}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedAnnouncement.announcementDescription}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <Avatar alt={selectedAnnouncement.author.name} sx={{ width: 32, height: 32, mr: 1 }} />
                  <Typography variant="subtitle1">{selectedAnnouncement.author.name}</Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {dayjs(selectedAnnouncement.createdAt).format('DD MMM YYYY')}
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
