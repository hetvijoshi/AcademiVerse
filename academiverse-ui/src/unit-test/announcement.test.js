import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import AnnouncementPage from '../app/(routes)/courses/announcements/annoucement';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

// Mock the next-auth useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => '1')
  }))
}));

const mockAnnouncements = [
  {
    announcementId: 5,
    announcementTitle: "No classes",
    announcementDescription: "Hello students,\nSorry to inform you at last moment but there will be no classes tomorrow.",
    author: {
      name: "Jainik Gadara",
      role: "professor"
    },
    createdAt: "2024-10-25T01:24:56.251908"
  },
  {
    announcementId: 6,
    announcementTitle: "Exam 5",
    announcementDescription: "On coming Monday you will have exam 5. Review lecture notes.",
    author: {
      name: "Jainik Gadara",
      role: "professor"
    },
    createdAt: "2024-10-25T01:41:40.621072"
  }
];

const mockFullAnnouncements = [
  {
    announcementId: 5,
    instructs: {
      instructId: 7,
      course: {
        courseId: 1,
        courseName: "SFWR ENG II: MGMT, MAIN, & QA",
        courseCode: "CSE-5325",
        courseDescription: "Basic concepts of software management",
        department: {
          departmentId: 1,
          departmentCode: "CSE",
          departmentName: "Computer Science"
        },
        degree: {
          degreeId: 1,
          degreeName: "MS"
        }
      }
    },
    announcementTitle: "No classes",
    announcementDescription: "Hello students,\nSorry to inform you at last moment but there will be no classes tomorrow.",
    author: {
      userId: 5,
      name: "Jainik Gadara",
      userEmail: "gadarajainik1@gmail.com",
      role: "professor"
    },
    createdAt: "2024-10-25T01:24:56.251908"
  },
  {
    announcementId: 6,
    instructs: {
      instructId: 7,
      course: {
        courseId: 1,
        courseName: "SFWR ENG II: MGMT, MAIN, & QA",
        courseCode: "CSE-5325"
      }
    },
    announcementTitle: "Exam 5",
    announcementDescription: "On coming Monday you will have exam 5. Review lecture notes.",
    author: {
      userId: 5,
      name: "Jainik Gadara",
      role: "professor"
    },
    createdAt: "2024-10-25T01:41:40.621072"
  }
];

// Mock the announcement service with correct path
jest.mock('../app/services/announcementService', () => ({
  fetchInstructAnnouncements: jest.fn(),
  saveAnnouncement: jest.fn(() => Promise.resolve({
    isError: false,
    message: 'Success'
  }))
}));

describe('AnnouncementPage', () => {
  // Create a theme instance for testing
  const theme = createTheme();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup default session mock
    useSession.mockReturnValue({
      data: {
        userDetails: {
          role: 'professor',
          userId: '1',
          name: 'Test Professor'
        },
        id_token: 'mock-token'
      },
      status: 'authenticated'
    });

    // Setup default announcement service mock
    const { fetchInstructAnnouncements } = require('../app/services/announcementService');
    fetchInstructAnnouncements.mockResolvedValue({
      isError: false,
      data: mockFullAnnouncements
    });
  });

  it('renders the announcement page with title', async () => {
    render(
      <ThemeProvider theme={theme}>
        <AnnouncementPage />
      </ThemeProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Course Announcements')).toBeInTheDocument();
    });
  });

  it('shows new announcement button for professors', async () => {
    render(
      <ThemeProvider theme={theme}>
        <AnnouncementPage />
      </ThemeProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('New Announcement')).toBeInTheDocument();
    });
  });

  it('hides new announcement button for students', async () => {
    useSession.mockReturnValue({
      data: {
        userDetails: {
          role: 'student',
          userId: '1',
          name: 'Test Student'
        },
        id_token: 'mock-token'
      },
      status: 'authenticated'
    });
    
    render(
      <ThemeProvider theme={theme}>
        <AnnouncementPage />
      </ThemeProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText('New Announcement')).not.toBeInTheDocument();
    });
  });

  it('displays announcements when data is available', async () => {
    const { fetchInstructAnnouncements } = require('../app/services/announcementService');
    fetchInstructAnnouncements.mockResolvedValueOnce({
      isError: false,
      data: mockFullAnnouncements
    });

    render(
      <ThemeProvider theme={theme}>
        <AnnouncementPage />
      </ThemeProvider>
    );

    // Wait for and verify the announcements are displayed
    await waitFor(() => {
      expect(screen.getByText('No classes')).toBeInTheDocument();
    //   expect(screen.getByText('Exam 5')).toBeInTheDocument();
    //   expect(screen.getByText(/Hello students/)).toBeInTheDocument();
    //   expect(screen.getByText(/On coming Monday/)).toBeInTheDocument();
    //   expect(screen.getByText('CSE-5325')).toBeInTheDocument();
    //   expect(screen.getByText('SFWR ENG II: MGMT, MAIN, & QA')).toBeInTheDocument();
    });
  });

  it('handles empty announcement data', async () => {
    const { fetchInstructAnnouncements } = require('../app/services/announcementService');
    fetchInstructAnnouncements.mockResolvedValueOnce({
      isError: false,
      data: []
    });

    render(
      <ThemeProvider theme={theme}>
        <AnnouncementPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Course Announcements')).toBeInTheDocument();
    });
  });
});
