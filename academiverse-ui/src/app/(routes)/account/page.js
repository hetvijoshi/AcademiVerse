'use client';
import React, { useState, useEffect } from 'react';
import { Paper, Grid, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/system';
import { useSession } from 'next-auth/react';
import { getAllDepartment } from '../../services/departmentService';
import { getAllDegree } from '../../services/degree';
import { getUserDetails } from '../../services/userService';


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
        email: '',
        role: '',
        department: '',
        degree: '',
    });
    const [departments, setDepartments] = useState([]);
    const [degrees, setDegrees] = useState([]);

    useEffect(() => {
        // Fetch profile data
        const fetchProfile = async () => {
            // Replace with actual API call
            const res = await getUserDetails(session.userDetails?.userId, session["id_token"]);
            if (!res.isError) {
                const profileData = {
                    id: res.data?.userId,
                    name: res.data?.name,
                    email: res.data?.userEmail,
                    role: res.data?.role,
                    department: res.data?.department?.departmentName,
                    degree: res.data?.degree?.degreeName,
                };
                setProfile(profileData);
            }
        };

        // Fetch departments
        const fetchDepartments = async () => {
            // Replace with actual API call
            const res = await getAllDepartment(session["id_token"]);
            let departmentsData = [];
            if (!res.isError) {
                departmentsData = res.data;
            }
            // const departmentsData = [
            //     { id: 1, departmentName: 'Computer Science' },
            //     { id: 2, departmentName: 'Mathematics' },
            //     { id: 3, departmentName: 'Physics' }
            // ];
            setDepartments(departmentsData);
        };

        // Fetch degrees
        const fetchDegrees = async () => {
            // Replace with actual API call
            const res = await getAllDegree(session["id_token"]);
            let degreesData = [];
            if (!res.isError) {
                degreesData = res.data;
            }
            // const degreesData = [
            //     { id: 1, degreeName: 'Bachelor of Science' },
            //     { id: 2, degreeName: 'Master of Science' },
            //     { id: 3, degreeName: 'PhD' }
            // ];
            setDegrees(degreesData);
        };

        fetchProfile();
        fetchDepartments();
        fetchDegrees();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Replace with actual API call to update profile
        console.log('Updated profile:', profile);
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
                        value={profile.email}
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
        </ProfileContainer>
    );
};

export default AccountPage;
