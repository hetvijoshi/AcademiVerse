'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, List, ListItem, ListItemIcon, ListItemText, 
  Accordion, AccordionSummary, AccordionDetails, CircularProgress,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from '@mui/material';
import { styled } from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  Description as FileIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  margin: '0',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
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
}));

const ModuleTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
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

  useEffect(() => {
    // Simulating an API call to fetch modules
    const fetchModules = async () => {
      try {
        // Replace this with your actual API call
        const response = await new Promise(resolve =>
          setTimeout(() => resolve([
            {
              id: 1,
              title: 'Introduction to the Course',
              materials: [
                { id: 1, type: 'file', name: 'Syllabus.pdf' },
                { id: 2, type: 'file', name: 'Course Overview.pptx' },
              ]
            },
            {
              id: 2,
              title: 'Fundamentals of Programming',
              materials: [
                { id: 3, type: 'folder', name: 'Lecture Notes' },
                { id: 4, type: 'file', name: 'Programming Basics.pdf' },
                { id: 5, type: 'file', name: 'Coding Exercise 1.zip' },
              ]
            },
            // Add more modules as needed
          ]), 1000)
        );
        setModules(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const isProfessor = session?.userDetails?.role === 'professor';

  const handleAddModule = () => {
    // Add logic to create a new module
    const newModule = {
      id: modules.length + 1,
      title: newModuleTitle,
      materials: []
    };
    setModules([...modules, newModule]);
    setOpenAddModule(false);
    setNewModuleTitle('');
  };

  const handleAddDocument = () => {
    // Add logic to upload a document to the selected module
    if (selectedFile && selectedModuleId) {
      const updatedModules = modules.map(module => {
        if (module.id === selectedModuleId) {
          return {
            ...module,
            materials: [...module.materials, { id: Date.now(), type: 'file', name: selectedFile.name }]
          };
        }
        return module;
      });
      setModules(updatedModules);
      setOpenAddDocument(false);
      setSelectedFile(null);
      setSelectedModuleId(null);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Paper elevation={0} sx={{ padding: 3, backgroundColor: 'white', flexGrow: 1 }}>
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
          ) : (
            modules.map((module) => (
              <ModuleAccordion key={module.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ModuleTitle variant="h6">{module.title}</ModuleTitle>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {module.materials.map((material) => (
                      <MaterialItem key={material.id} button>
                        <ListItemIcon>
                          {material.type === 'folder' ? <FolderIcon color="primary" /> : <FileIcon color="primary" />}
                        </ListItemIcon>
                        <ListItemText primary={material.name} />
                      </MaterialItem>
                    ))}
                  </List>
                </AccordionDetails>
              </ModuleAccordion>
            ))
          )}
        </Paper>
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
            <option value="">Select a module</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
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
    </PageContainer>
  );
};

export default ModulePage;
