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
import { postAssignmentsByInstructId } from "../../../services/assignmentService";
import { useSearchParams } from "next/navigation";
import { getAssignmentsByInstructId } from "../../../services/assignmentService";
const PageContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	width: "100%",
	backgroundColor: "#f5f5f5",
	minHeight: "100vh",
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
	useEffect(() => {
		const fetchAssignment = async () => {
			const response = await getAssignmentsByInstructId(
				instructId,
				session.id_token,
			);
			console.log("getAssignmentsssssssssss", response);
			if (response.data) {
				const mappedAssignments = response.data.map((assignment) => ({
					id: assignment.assignmentId,
					title: assignment.assignmentTitle,
					dueDate: dayjs(assignment.assignmentDueDate).format(
						"YYYY-MM-DD HH:mm",
					),
					description: assignment.assignmentDescription,
					totalMarks: assignment.totalMarks,
					isActive: assignment.isActive,
				}));
				console.log("Mapped assignments:", mappedAssignments);
				setAssignments(mappedAssignments);
				console.log("Assignments stateeeeeeeee:", assignments);
			} else {
				console.error("No assignments data received from API");
				setAssignments([]);
			}
		};
		fetchAssignment();
	}, []);

	const handleCreateAssignment = (data) => {
		// Format the data according to the API requirements
		const formattedData = {
			instructId: instructId,
			assignmentTitle: data.title,
			assignmentDescription: data.description,
			assignmentDueDate: data.dueDate.toISOString(),
			assignmentWeightage: 0.0,
			totalMarks: Number.parseInt(data.totalMarks),
			isActive: true,
		};
		// Send the formatted data to the API
		const response = postAssignmentsByInstructId(
			formattedData,
			session.id_token,
		);
		setAssignments([
			...assignments,
			{ ...response, id: Date.now(), isActive: true },
		]);
		setOpenDialog(false);
		setNewAssignment({
			title: "",
			description: "",
			dueDate: dayjs(),
			totalMarks: 0,
		});
		setSnackbarMessage("Assignment created successfully!");
		setSnackbarOpen(true);
	};

	const handleToggleAssignment = (id) => {
		setAssignments(
			assignments.map((assignment) =>
				assignment.id === id
					? { ...assignment, isActive: !assignment.isActive }
					: assignment,
			),
		);
	};

	const handleEditAssignment = (id) => {
		// Open edit dialog
		setEditAssignment(assignments.find((assignment) => assignment.id === id));
		setEditDialogOpen(true);
	};

	const handleEditSaveAssignment = () => {
		//API call for edit assignment
		setEditDialogOpen(false);
		setEditAssignment(null);
		setSnackbarMessage("Assignment edited successfully!");
		setSnackbarOpen(true);
	};

	const handleDeleteAssignment = (id) => {
		setAssignmentToDelete(
			assignments.find((assignment) => assignment.id === id),
		);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		// Implement delete functionality
		setAssignments(
			assignments.filter(
				(assignment) => assignment.id !== assignmentToDelete.id,
			),
		);
		setDeleteDialogOpen(false);
		setAssignmentToDelete(null);
		setSnackbarMessage("Assignment deleted successfully!");
		setSnackbarOpen(true);
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
				<Typography variant="h4">Assignments</Typography>
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
							secondary={`Due: ${dayjs(assignment.dueDate).format("YYYY-MM-DD HH:mm:ss")} | Marks: ${assignment.totalMarks}`}
						/>
						<Switch
							checked={assignment.isActive}
							onChange={() => handleToggleAssignment(assignment.id)}
						/>
						<IconButton onClick={() => handleEditAssignment(assignment.id)}>
							<EditIcon />
						</IconButton>
						<IconButton onClick={() => handleDeleteAssignment(assignment.id)}>
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
						onClick={handleConfirmDelete}
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
