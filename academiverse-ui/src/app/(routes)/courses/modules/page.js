'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemIcon, ListItemText,
  Accordion, AccordionSummary, AccordionDetails, CircularProgress,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  Description as FileIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ViewModule as ModuleIcon
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getModules, saveModules, uploadDocument } from '../../../services/moduleService';
import { deleteDocument, saveDocument } from '../../../services/documentService';
import { EmptyStateContainer } from '../../../../components/EmptyState/EmptyState';

const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  //marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ModuleAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  backgroundColor: theme.palette.grey[100],
  '&.Mui-expanded': {
    backgroundColor: theme.palette.background.paper,
  },
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const ModuleTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

const MaterialItem = styled(ListItem)(({ theme }) => ({
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
}));

const ModulePage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [openAddModule, setOpenAddModule] = useState(false);
  const [openAddDocument, setOpenAddDocument] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [openFileViewer, setOpenFileViewer] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const searchParams = useSearchParams();
  const instructId = searchParams.get('id');
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });


  const fetchModules = async () => {
    try {
      // Replace this with your actual API call
      const res = await getModules(instructId, session.id_token);
      if (!res.isError) {
        setModules(res.data);
      } else {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'error',
        });
      }


      // Set all modules to expanded by default
      const initialExpandedState = res.data.reduce((acc, module) => {
        acc[module.moduleId] = true;
        return acc;
      }, {});
      setExpandedModules(initialExpandedState);
      setLoading(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error while fetching modules.",
        severity: 'error',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instructId > 0) {
      fetchModules();
    } else {
      router.push(`/`);
    }
  }, []);

  const isProfessor = session?.userDetails?.role === 'professor';

  const handleAddModule = async () => {
    // Add logic to create a new module
    const reqData = {
      instructId: instructId,
      moduleName: newModuleTitle,
      createdBy: session?.userDetails?.userId,
      updatedBy: session?.userDetails?.userId
    }
    const res = await saveModules(reqData, session.id_token);
    if (!res.isError) {
      setExpandedModules(prev => ({ ...prev, [res.data.moduleId]: true }));
      setOpenAddModule(false);
      setNewModuleTitle('');
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
    fetchModules();
  };

  const handleAddDocument = async () => {
    // Add logic to upload a document to the selected module
    if (selectedFile && selectedModuleId) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res1 = await uploadDocument(formData, session.id_token);
      if (!res1.isError) {
        setSelectedFile(null);

        const reqData = {
          instructId: instructId,
          moduleId: selectedModuleId,
          moduleName: selectedFile.name,
          //moduleLink: URL.createObjectURL(selectedFile),
          moduleLink: res1.data,
          createdBy: session?.userDetails?.userId,
          updatedBy: session?.userDetails?.userId
        };

        const res = await saveDocument(reqData, session.id_token);
        if (!res.isError) {
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
        fetchModules();
        setOpenAddDocument(false);
        setSelectedFile(null);
        setSelectedModuleId(null);
      } else {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'error',
        });
      }


    }
  };

  const handleAccordionChange = (moduleId) => (event, isExpanded) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: isExpanded }));
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    setOpenFileViewer(true);
  };

  const handleCloseFileViewer = () => {
    setOpenFileViewer(false);
    setSelectedMaterial(null);
  };

  const handleDeleteMaterial = async (e, moduleId, materialId) => {
    e.stopPropagation();
    const res = await deleteDocument(materialId, session.id_token);
    if (!res.isError) {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'success',
      });
      fetchModules();
    } else {
      setSnackbar({
        open: true,
        message: res.message,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Paper elevation={0} sx={{ backgroundColor: 'white', flexGrow: 1 }}>
          <TitleSection>
            <Typography variant="h4" fontWeight="bold" color="primary">Course Modules</Typography>
            {isProfessor && (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ marginRight: 2 }}
                  onClick={() => setOpenAddModule(true)}
                >
                  Add Module
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddDocument(true)}
                >
                  Add Document
                </Button>
              </Box>
            )}
          </TitleSection>
          {loading ? (
            <LoadingContainer>
              <CircularProgress />
            </LoadingContainer>
          ) : (modules.length > 0 ?
            modules.map((module) => (
              <ModuleAccordion
                key={module.moduleId}
                expanded={expandedModules[module.moduleId]}
                onChange={handleAccordionChange(module.moduleId)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'grey.100',
                    '&.Mui-expanded': {
                      backgroundColor: 'background.paper',
                    },
                  }}
                >
                  <ModuleTitle variant="h6">{module.moduleName}</ModuleTitle>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'background.paper' }}>
                  <List>
                    {module.documents.map((material) => (
                      <MaterialItem
                        key={material.moduleId}
                        button
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleMaterialClick(material)}
                      >
                        <ListItemIcon>
                          <FileIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={material.moduleName} />
                        {isProfessor && (
                          <IconButton onClick={(e) => handleDeleteMaterial(e, module.moduleId, material.moduleId)}>
                            <DeleteIcon color="primary" />
                          </IconButton>
                        )}
                      </MaterialItem>
                    ))}
                  </List>
                </AccordionDetails>
              </ModuleAccordion>
            )) : <EmptyStateContainer>
              <ModuleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No Modules Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 450 }}>
                {isProfessor
                  ? "Start engaging with your students by creating your first course announcement."
                  : "There are no announcements for this course yet. Check back later for updates from your professor."}
              </Typography>
            </EmptyStateContainer>
          )}
        </Paper>
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
      </ContentWrapper>

      {/* Add Module Dialog */}
      <Dialog open={openAddModule} onClose={() => setOpenAddModule(false)}>
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="module-title"
            label="Module Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModule(false)}>Cancel</Button>
          <Button onClick={handleAddModule} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={openAddDocument} onClose={() => setOpenAddDocument(false)}>
        <DialogTitle>Add Document to Module</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            id="module-select"
            label="Select Module"
            fullWidth
            variant="outlined"
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(Number(e.target.value))}
            SelectProps={{
              native: true,
            }}
          >
            <option>
              Select Module
            </option>
            {modules.map((module) => (
              <option key={module.moduleId} value={module.moduleId}>
                {module.moduleName}
              </option>
            ))}
          </TextField>
          <input
            accept="*/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" fullWidth sx={{ mt: 2 }}>
              Choose File
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDocument(false)}>Cancel</Button>
          <Button onClick={handleAddDocument} variant="contained" color="primary">Upload</Button>
        </DialogActions>
      </Dialog>

      {/* File Viewer Dialog */}
      <Dialog
        open={openFileViewer}
        onClose={handleCloseFileViewer}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedMaterial?.moduleName}
          <IconButton
            aria-label="close"
            onClick={handleCloseFileViewer}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMaterial && (
            <iframe
              src={selectedMaterial.moduleLink}
              width="100%"
              height="600px"
              title={selectedMaterial.moduleName}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default ModulePage;
