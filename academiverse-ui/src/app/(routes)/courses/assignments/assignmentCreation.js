"use client";

import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Switch,
	Paper,
	Snackbar,
	Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { activeAssignment, postAssignmentsByInstructId, updateAssignment } from "../../../services/assignmentService";
import { useSearchParams } from "next/navigation";
import { getAssignmentsByInstructId } from "../../../services/assignmentService";
import { deleteAssignment } from "../../../services/assignmentService";
const PageContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	padding: theme.spacing(3),
	//marginLeft: theme.spacing(2),
	backgroundColor: theme.palette.background.paper,
}));

const TitleSection = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(4),
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
}));

const AssignmentItem = styled(ListItem)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	backgroundColor: theme.palette.background.paper,
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
	paddingTop: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

const AssignmentCreationPage = () => {
	const { data: session } = useSession();
	const [assignments, setAssignments] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newAssignment, setNewAssignment] = useState({
		title: "",
		description: "",
		dueDate: dayjs(),
		totalMarks: 0,
	});
	const [editAssignment, setEditAssignment] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [assignmentToDelete, setAssignmentToDelete] = useState(null);
	const searchParams = useSearchParams();
	const instructId = searchParams.get("id");
	const fetchAssignment = async () => {
		const response = await getAssignmentsByInstructId(
			instructId,
			session.id_token,
		);
		if (response.data) {
			const mappedAssignments = response.data.map((assignment) => ({
				id: assignment.assignmentId,
				title: assignment.assignmentTitle,
				dueDate: dayjs(assignment.assignmentDueDate),
				description: assignment.assignmentDescription,
				totalMarks: assignment.totalMarks,
				isActive: assignment.active,
			}));
			setAssignments(mappedAssignments);
		} else {
			console.error("No assignments data received from API");
			setAssignments([]);
		}
	};

	useEffect(() => {
		fetchAssignment();
	}, []);

	const handleCreateAssignment = async (data) => {
		// Format the data according to the API requirements
		const formattedData = {
			instructId: instructId,
			assignmentTitle: data.title,
			assignmentDescription: data.description.replace(/\n/g, '\n'),
			assignmentDueDate: data.dueDate.format('YYYY-MM-DDTHH:mm:ss'),
			assignmentWeightage: 0.0,
			totalMarks: Number.parseInt(data.totalMarks),
			isActive: true,
			createdBy: session?.userDetails?.userId,
			updatedBy: session?.userDetails?.userId
		};
		// Send the formatted data to the API
		await postAssignmentsByInstructId(
			formattedData,
			session.id_token,
		);
		await fetchAssignment();
		setOpenDialog(false);
		setSnackbarMessage("Assignment created successfully!");
		setSnackbarOpen(true);
	};

	const handleToggleAssignment = async (id) => {
		const res = await activeAssignment(id, session.id_token);
		if (!res.isError) {
			await fetchAssignment();
			setSnackbarMessage(res.message);
			setSnackbarOpen(true);
		} else {
			setSnackbarMessage(res.message);
			setSnackbarOpen(true);
		}
	};

	const handleEditAssignment = (id) => {
		// Open edit dialog
		setEditAssignment(assignments.find((assignment) => assignment.id === id));
		setEditDialogOpen(true);
	};

	const handleEditSaveAssignment = async () => {
		//API call for edit assignment

		const formattedData = {
			assignmentId: editAssignment.id,
			instructId: instructId,
			assignmentTitle: editAssignment.title,
			assignmentDescription: editAssignment.description.replace(/\n/g, '\n'),
			assignmentDueDate: editAssignment.dueDate.format('YYYY-MM-DDTHH:mm:ss'),
			assignmentWeightage: 0.0,
			totalMarks: Number.parseInt(editAssignment.totalMarks),
			active: editAssignment.isActive,
			updatedBy: session?.userDetails?.userId
		};
		const res = await updateAssignment(formattedData, session.id_token);
		if (!res.isError) {
			await fetchAssignment();
			setSnackbarMessage(res.message);
			setSnackbarOpen(true);
		} else {
			setSnackbarMessage(res.message);
			setSnackbarOpen(true);
		}

		setEditDialogOpen(false);
		setEditAssignment(null);
	};

	const handleDeleteAssignment = (id) => {
		setAssignmentToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		const res = await deleteAssignment(assignmentToDelete, session.id_token);
		if (!res.isError) {
			await fetchAssignment();
			setDeleteDialogOpen(false);
			setAssignmentToDelete(null);
			setSnackbarMessage(res.message);
			setSnackbarOpen(true);
		} else {
			setSnackbarMessage(res.message);
			setSnackbarOpen(true);
		}
	};

	if (session?.userDetails?.role !== "professor") {
		return (
			<Typography>
				Access Denied. Only professors can view this page.
			</Typography>
		);
	}

	return (
		<PageContainer>
			<TitleSection>
				<Typography variant="h4" fontWeight="bold" color="primary">Assignments</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={() => setOpenDialog(true)}
				>
					Create Assignment
				</Button>
			</TitleSection>

			<List>
				{assignments.map((assignment) => (
					<AssignmentItem key={assignment.id}>
						<ListItemText
							primary={assignment.title}
							secondary={`Due: ${dayjs(assignment.dueDate).format("YYYY-MM-DD hh:mm A")} | Marks: ${assignment.totalMarks}`}
						/>
						<Switch
							checked={assignment.isActive}
							onChange={() => handleToggleAssignment(assignment.id)}
						/>
						<IconButton disabled={!assignment.isActive} onClick={() => handleEditAssignment(assignment.id)}>
							<EditIcon />
						</IconButton>
						<IconButton disabled={!assignment.isActive} onClick={() => handleDeleteAssignment(assignment.id)}>
							<DeleteIcon />
						</IconButton>
					</AssignmentItem>
				))}
			</List>

			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>Create New Assignment</DialogTitle>
				<StyledDialogContent>
					<Box mt={2}>
						<Box mb={2}>
							<StyledTextField
								autoFocus
								label="Assignment Title"
								fullWidth
								value={newAssignment.title}
								onChange={(e) =>
									setNewAssignment({ ...newAssignment, title: e.target.value })
								}
							/>
						</Box>
						<Box mb={2}>
							<StyledTextField
								label="Description"
								fullWidth
								multiline
								rows={4}
								value={newAssignment.description}
								onChange={(e) =>
									setNewAssignment({
										...newAssignment,
										description: e.target.value,
									})
								}
							/>
						</Box>
						<Box mb={2}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									label="Due Date"
									value={newAssignment.dueDate}
									onChange={(newValue) =>
										setNewAssignment({ ...newAssignment, dueDate: newValue })
									}
									renderInput={(params) => (
										<StyledTextField {...params} fullWidth />
									)}
								/>
							</LocalizationProvider>
						</Box>
						<Box mb={2}>
							<StyledTextField
								label="Total Marks"
								type="number"
								fullWidth
								value={newAssignment.totalMarks}
								onChange={(e) =>
									setNewAssignment({
										...newAssignment,
										totalMarks: Number.parseInt(e.target.value),
									})
								}
							/>
						</Box>
					</Box>
				</StyledDialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
					<Button
						onClick={() => handleCreateAssignment(newAssignment)}
						variant="contained"
						color="primary"
					>
						Create
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>Edit Assignment</DialogTitle>
				<StyledDialogContent>
					<Box mt={2}>
						<Box mb={2}>
							<StyledTextField
								autoFocus
								label="Assignment Title"
								fullWidth
								value={editAssignment?.title}
								onChange={(e) =>
									setEditAssignment({
										...editAssignment,
										title: e.target.value,
									})
								}
							/>
						</Box>
						<Box mb={2}>
							<StyledTextField
								label="Description"
								fullWidth
								multiline
								rows={4}
								value={editAssignment?.description}
								onChange={(e) =>
									setEditAssignment({
										...editAssignment,
										description: e.target.value,
									})
								}
							/>
						</Box>
						<Box mb={2}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									label="Due Date"
									value={editAssignment?.dueDate}
									onChange={(newValue) =>
										setEditAssignment({ ...editAssignment, dueDate: newValue })
									}
									renderInput={(params) => (
										<StyledTextField {...params} fullWidth />
									)}
								/>
							</LocalizationProvider>
						</Box>
						<Box mb={2}>
							<StyledTextField
								label="Total Marks"
								type="number"
								fullWidth
								value={editAssignment?.totalMarks}
								onChange={(e) =>
									setEditAssignment({
										...editAssignment,
										totalMarks: Number.parseInt(e.target.value),
									})
								}
							/>
						</Box>
					</Box>
				</StyledDialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={handleEditSaveAssignment}
						variant="contained"
						color="primary"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Delete Assignment</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete this assignment?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={() => handleConfirmDelete()}
						variant="contained"
						color="primary"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={() => setSnackbarOpen(false)}
			>
				<Alert severity="success" sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</PageContainer>
	);
};

export default AssignmentCreationPage;
