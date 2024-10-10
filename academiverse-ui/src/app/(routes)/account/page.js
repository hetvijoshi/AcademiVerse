'use client';
import React, { useState, useEffect } from 'react';
import { Paper, Grid, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { useSession } from 'next-auth/react';
import { getAllDepartment } from '../../services/departmentService';
import { getAllDegree } from '../../services/degree';
import { getUserDetails, putUserDetails } from '../../services/userService';


const ProfileContainer = styled(Paper)(({ theme }) => ({
    maxWidth: '800px',
    margin: '2rem auto',
    padding: theme.spacing(4),
    borderRadius: '12px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
}));

const FormField = styled(Grid)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '100%',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    width: '100%',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const AccountPage = () => {
    const { data: session } = useSession();
    const [profile, setProfile] = useState({
        id: '',
        name: '',
        userEmail: '',
        role: '',
        department: '',
        degree: '',
        departmentId: '',
        degreeId: '',
    });
    const [departments, setDepartments] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        // Fetch profile data
        const fetchProfile = async () => {
            const res = await getUserDetails(session.userDetails?.userId, session["id_token"]);
            if (!res.isError) {
                const profileData = {
                    id: res.data?.userId,
                    name: res.data?.name,
                    userEmail: res.data?.userEmail,
                    role: res.data?.role,
                    department: res.data?.department?.departmentName,
                    degree: res.data?.degree?.degreeName,
                    departmentId: res.data?.department?.departmentId,
                    degreeId: res.data?.degree?.degreeId,
                };
                setProfile(profileData);
            }
        };

        // Fetch departments
        const fetchDepartments = async () => {
            const res = await getAllDepartment(session["id_token"]);
            let departmentsData = [];
            if (!res.isError) {
                departmentsData = res.data;
            }
            setDepartments(departmentsData);
        };

        // Fetch degrees
        const fetchDegrees = async () => {
            const res = await getAllDegree(session["id_token"]);
            let degreesData = [];
            if (!res.isError) {
                degreesData = res.data;
            }
            setDegrees(degreesData);
        };

        fetchProfile();
        fetchDepartments();
        fetchDegrees();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'department') {
            let id = departments.find(dept => dept.departmentName === value)?.departmentId;
            setProfile((prevProfile) => ({
                ...prevProfile,
                departmentId: id
            }));
        } else if (name === 'degree') {
            let id = degrees.find(deg => deg.degreeName === value)?.degreeId;
            setProfile((prevProfile) => ({
                ...prevProfile,
                degreeId: id
            }));
        }
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Replace with actual API call to update profile
        let data = profile;
        data.updatedBy = session.userDetails.userId;
        console.log(data);
        const res = await putUserDetails(data, session["id_token"]);
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
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <ProfileContainer>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormField>
                    <StyledTextField
                        fullWidth
                        label="ID"
                        value={profile.id}
                        disabled
                    />
                </FormField>
                <FormField>
                    <StyledTextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                    />
                </FormField>
                <FormField>
                    <StyledTextField
                        fullWidth
                        label="Email"
                        value={profile.userEmail}
                        disabled
                    />
                </FormField>
                <FormField>
                    <StyledTextField
                        fullWidth
                        label="Role"
                        value={profile.role}
                        disabled
                    />
                </FormField>
                <FormField>
                    <FormControl fullWidth>
                        <InputLabel id="department-label">Department</InputLabel>
                        <StyledSelect
                            id="department-label"
                            label="Department"
                            name="department"
                            value={profile.department}
                            onChange={handleChange}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.departmentName}>
                                    {dept.departmentName}
                                </MenuItem>
                            ))}
                        </StyledSelect>
                    </FormControl>
                </FormField>
                <FormField>
                    <FormControl fullWidth>
                        <InputLabel id="degree-label">Degree</InputLabel>
                        <StyledSelect
                            id="degree-label"
                            label="Degree"
                            name="degree"
                            value={profile.degree}
                            onChange={handleChange}
                        >
                            {degrees.map((deg) => (
                                <MenuItem key={deg.id} value={deg.degreeName}>
                                    {deg.degreeName}
                                </MenuItem>
                            ))}
                        </StyledSelect>
                    </FormControl>
                </FormField>
                <StyledButton type="submit" variant="contained" color="primary">
                    Save Changes
                </StyledButton>
            </form>
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
        </ProfileContainer>
    );
};

export default AccountPage;
