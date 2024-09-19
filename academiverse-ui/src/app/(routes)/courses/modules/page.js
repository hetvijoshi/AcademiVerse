'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, List, ListItem, ListItemIcon, ListItemText, 
  Accordion, AccordionSummary, AccordionDetails, CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { 
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  Description as FileIcon
} from '@mui/icons-material';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto',
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ModuleAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
}));

const ModulePage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <PageContainer>
      <TitleSection>
        <Typography variant="h4" fontWeight="bold" color="primary">Course Modules</Typography>
      </TitleSection>
      {loading ? (
        <CircularProgress />
      ) : (
        modules.map((module) => (
          <ModuleAccordion key={module.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{module.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {module.materials.map((material) => (
                  <ListItem key={material.id} button>
                    <ListItemIcon>
                      {material.type === 'folder' ? <FolderIcon /> : <FileIcon />}
                    </ListItemIcon>
                    <ListItemText primary={material.name} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </ModuleAccordion>
        ))
      )}
    </PageContainer>
  );
};

export default ModulePage;
