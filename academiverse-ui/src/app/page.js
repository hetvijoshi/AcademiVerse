"use client";

import React, { useState, useEffect } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	IconButton,
	CircularProgress,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
	Autocomplete,
	Snackbar,
	Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
	Announcement as AnnouncementIcon,
	ViewModule as ModuleIcon,
	Assignment as AssignmentIcon,
	Grade as GradeIcon,
	Quiz as QuizIcon,
	List as ListIcon,
	People as PeopleIcon,
	HowToReg as EnrollmentIcon,
	Add as AddIcon,
	Edit as EditIcon,
	School,
} from "@mui/icons-material";
import { editInstruct, fetchInstructCourses, fetchStudentCourses } from "./services/instructService";
import { getCourseByDeptId } from "./services/courseService";
import { getAllDepartment } from "./services/departmentService";
import { saveInstruct } from "./services/instructService";

const StyledCard = styled(Card)(({ theme }) => ({
	height: '100%',
	minHeight: '220px',
	display: 'flex',
	flexDirection: 'column',
	transition: 'all 0.3s ease-in-out',
	backgroundColor: theme.palette.background.paper,
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	borderRadius: '16px',
	overflow: 'hidden',
	border: '1px solid rgba(37, 99, 235, 0.1)',
	'&:hover': {
		transform: 'translateY(-4px)',
		boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		borderColor: theme.palette.primary.main,
		backgroundColor: theme.palette.background.paper,
	},
}));

const CardHeader = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	borderBottom: '1px solid rgba(37, 99, 235, 0.1)',
	backgroundColor: theme.palette.background.paper,
	'& .MuiTypography-root': {
		fontSize: '1.1rem',
		fontWeight: 600,
		color: theme.palette.primary.main,
	},
}));

const CardBody = styled(CardContent)(({ theme }) => ({
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	padding: theme.spacing(3),
	backgroundColor: theme.palette.background.paper,
	'& .MuiTypography-body2': {
		fontSize: '0.95rem',
		color: theme.palette.text.secondary,
		marginBottom: theme.spacing(1),
	},
}));

const IconContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
	gap: theme.spacing(1),
	marginTop: theme.spacing(2),
	'& .MuiIconButton-root': {
		color: theme.palette.text.secondary,
		'&:hover': {
			backgroundColor: 'rgba(37, 99, 235, 0.1)',
			color: theme.palette.primary.main,
		},
	},
}));

const CourseContainer = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
	gap: theme.spacing(4),
	padding: theme.spacing(0),
}));

const CourseItem = styled(Box)(({ theme }) => ({
	flexBasis: 'calc(33.333% - ${theme.spacing(2)})',
	[theme.breakpoints.down('md')]: {
		flexBasis: 'calc(50% - ${theme.spacing(2)})',
	},
	[theme.breakpoints.down('sm')]: {
		flexBasis: '100%',
	},
	cursor: 'pointer'
}));

const TitleSection = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	marginBottom: theme.spacing(3),
	display: 'flex',
	flexDirection: 'column',
	gap: '8px',
}));

const ContentSection = styled(Box)(({ theme }) => ({
	width: '100%',
	padding: theme.spacing(0),
	overflowY: 'auto',
}));

const CourseScreen = () => {
	const router = useRouter();
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCourseId, setSelectedCourseId] = useState(null);
	const { data: session } = useSession();
	const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);
	const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
	const [editingCourse, setEditingCourse] = useState(null);
	const [newCourse, setNewCourse] = useState({
		department: null,
		course: null,
		capacity: "",
		days: [],
		startTime: "",
		endTime: "",
		semester: "",
		year: new Date().getFullYear(),
	});
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [departments, setDepartments] = useState([]);
	const [courseList, setCourseList] = useState([]);
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const semesters = ["Fall", "Spring", "Summer"];

	const studentEnrolledCourses = async () => {
		const res = await fetchStudentCourses(
			session.userDetails?.userId,
			"2024",
			"Fall",
			session.id_token,
		);
		if (!res.isError) {
			const mappedCourses = res.data.map((course) => ({
				id: course.instructId,
				courseId: course.course.courseId,
				code: course.course.courseCode,
				name: course.course.courseName,
				color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
				days: course.courseDays
					? course.courseDays.split(",").map((day) => day.trim())
					: [],
				startTime: course.courseStartTime,
				endTime: course.courseEndTime,
				capacity: course.courseCapacity,
				semester: course.semester,
				year: course.year,
			}));
			setCourses(mappedCourses);
		} else {
			setSnackbar({
				open: true,
				message: res.message,
				severity: "error",
			});
		}
	}

	const professorEnrolledCourses = async () => {
		const res = await fetchInstructCourses(
			session.userDetails?.userId,
			"2024",
			"Fall",
			session.id_token,
		);
		if (!res.isError) {
			const mappedCourses = res.data.map((course) => ({
				id: course.instructId,
				courseId: course.course.courseId,
				code: course.course.courseCode,
				name: course.course.courseName,
				color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
				days: course.courseDays
					? course.courseDays.split(",").map((day) => day.trim())
					: [],
				startTime: course.courseStartTime,
				endTime: course.courseEndTime,
				capacity: course.courseCapacity,
				semester: course.semester,
				year: course.year,
			}));
			setCourses(mappedCourses);
		} else {
			setSnackbar({
				open: true,
				message: res.message,
				severity: "error",
			});
		}
	};

	useEffect(() => {
		if (session?.userDetails?.role === "professor") {
			professorEnrolledCourses();
		} else {
			studentEnrolledCourses();
		}
		setLoading(false);
	}, []);

	const handleCourseClick = (courseId) => {
		setSelectedCourseId(courseId);
		router.push(`/courses?id=${courseId}&section=announcements`);
	};

	const getDepartments = async () => {
		const res = await getAllDepartment(session.id_token);
		setDepartments(res.data);
	};

	const getCourses = async (departmentId) => {
		const res = await getCourseByDeptId(departmentId, session.id_token);
		setCourseList(res.data);
	};

	const handleAddCourse = () => {
		getDepartments();
		setOpenAddCourseDialog(true);
	};

	const handleCloseAddCourseDialog = () => {
		professorEnrolledCourses();
		setOpenAddCourseDialog(false);
		setNewCourse({
			department: null,
			course: null,
			capacity: "",
			days: [],
			startTime: "",
			endTime: "",
			semester: "",
			year: new Date().getFullYear(),
		});
	};

	const handleSaveNewCourse = async () => {
		const reqData = {
			courseId: newCourse.course.courseId,
			courseCapacity: newCourse.capacity,
			courseDays: newCourse.days.join(","),
			courseStartTime: newCourse.startTime,
			courseEndTime: newCourse.endTime,
			userId: session.userDetails?.userId,
			semester: newCourse.semester,
			year: newCourse.year,
			createdBy: session.userDetails?.userId,
			updatedBy: session.userDetails?.userId
		}
		const res = await saveInstruct(reqData, session.id_token);
		if (!res.isError) {
			setSnackbar({
				open: true,
				message: res.message,
				severity: "success",
			});
		} else {
			setSnackbar({
				open: true,
				message: res.message,
				severity: "error",
			});
		}
		handleCloseAddCourseDialog();
	};

	const handleNewCourseChange = (field, value) => {
		if (field === "department") {
			getCourses(value.departmentId);
		}
		setNewCourse((prev) => ({ ...prev, [field]: value }));
	};

	const handleEditCourse = (course) => {
		setEditingCourse(course);
		setOpenEditCourseDialog(true);
	};

	const handleCloseEditCourseDialog = () => {
		setOpenEditCourseDialog(false);
		setEditingCourse(null);
	};

	const editCourse = async (course) => {
		const reqData = {
			instructId: course.id,
			courseId: course.courseId,
			courseCapacity: course.capacity,
			courseDays: course.days.join(","),
			courseStartTime: course.startTime,
			courseEndTime: course.endTime,
			userId: session.userDetails?.userId,
			semester: course.semester,
			year: course.year,
			updatedBy: session.userDetails?.userId
		}

		const res = await editInstruct(reqData, session.id_token);
		if (!res.isError) {
			professorEnrolledCourses();
			setSnackbar({
				open: true,
				message: res.message,
				severity: "success",
			});
		} else {
			setSnackbar({
				open: true,
				message: res.message,
				severity: "error",
			});
		}
	};

	const handleSaveEditedCourse = () => {
		editCourse(editingCourse);
		handleCloseEditCourseDialog();
	};

	const handleEditCourseChange = (field, value) => {
		setEditingCourse((prev) => ({ ...prev, [field]: value }));
	};

	const icons = [
		{
			icon: <AnnouncementIcon />,
			label: "Announcements",
			section: "announcements",
		},
		{ icon: <ModuleIcon />, label: "Modules", section: "modules" },
		{ icon: <AssignmentIcon />, label: "Assignments", section: "assignments" },
		{ icon: <GradeIcon />, label: "Grades", section: "grades" },
		{ icon: <QuizIcon />, label: "Quiz", section: "quiz" },
		{ icon: <ListIcon />, label: "To Do List", section: "todo" },
		{ icon: <PeopleIcon />, label: "Classmates", section: "classmates" },
	];

	const isProfessor = session?.userDetails?.role === "professor";

	const handleIconClick = (courseId, section) => {
		router.push(`/courses?id=${courseId}&section=${section}`);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbar({ ...snackbar, open: false });
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				width: "100%",
			}}
		>
			<TitleSection>
				<Box sx={{ 
					display: 'flex', 
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%'
				}}>
					<Box>
						<Typography
							variant="h4"
							sx={{
								color: "primary.dark",
								fontWeight: 700,
								fontSize: "1.75rem",
								lineHeight: 1.2,
							}}
						>
							Welcome Back!
						</Typography>
						<Typography
							variant="subtitle1"
							sx={{
								color: "text.secondary",
								fontSize: "1rem",
								display: "flex",
								alignItems: "center",
								gap: 1,
								mt: 1,
							}}
						>
							<School sx={{ color: "primary.main", fontSize: "1.25rem" }} />
							Your Academic Dashboard
						</Typography>
					</Box>
					
					{isProfessor && (
						<Button
							variant="contained"
							color="primary"
							startIcon={<AddIcon />}
							onClick={handleAddCourse}
							sx={{
								backgroundColor: "primary.main",
								"&:hover": { backgroundColor: "primary.dark" },
								borderRadius: "8px",
								textTransform: "none",
								fontWeight: 600,
								height: '40px',
							}}
						>
							Add Course
						</Button>
					)}
				</Box>
			</TitleSection>

			<ContentSection>
				<CourseContainer>
					{loading ? (
						<CircularProgress />
					) : (
						<>
							{courses.map((course) => (
								<CourseItem key={course.id}>
									<StyledCard
										bgcolor={course.color}
										onClick={() => handleCourseClick(course.id)}
										sx={{
											border:
												selectedCourseId === course.id
													? "2px solid #1976D2"
													: "none",
											boxShadow:
												selectedCourseId === course.id
													? "0 0 20px rgba(25, 118, 210, 0.5)"
													: "none",
										}}
									>
										<CardHeader>
											<Typography
												variant="h6"
												component="div"
												sx={{ fontWeight: "bold", color: "rgba(0,0,0,0.8)" }}
											>
												{course.code}: {course.name}
											</Typography>
										</CardHeader>
										<CardBody>
											<Box>
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mb: 1 }}
												>
													Days:{" "}
													{Array.isArray(course.days)
														? course.days.join(", ")
														: "N/A"}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Time: {course.startTime} - {course.endTime}
												</Typography>
											</Box>
											<IconContainer>
												{icons.map((item, index) => (
													<IconButton
														key={index}
														title={item.label}
														onClick={(e) => {
															e.stopPropagation();
															handleIconClick(
																course.id,
																item.section.toLowerCase(),
															);
														}}
														sx={{
															color: "rgba(0,0,0,0.6)",
															"&:hover": { color: "rgba(0,0,0,0.8)" },
														}}
													>
														{item.icon}
													</IconButton>
												))}
												{isProfessor && (
													<>
														<IconButton
															title="Enrollments"
															onClick={(e) => {
																e.stopPropagation();
																handleIconClick(course.id, "enrollments");
															}}
															sx={{
																color: "rgba(0,0,0,0.6)",
																"&:hover": { color: "rgba(0,0,0,0.8)" },
															}}
														>
															<EnrollmentIcon />
														</IconButton>
														<IconButton
															title="Edit Course"
															onClick={(e) => {
																e.stopPropagation();
																handleEditCourse(course);
															}}
															sx={{
																color: "rgba(0,0,0,0.6)",
																"&:hover": { color: "rgba(0,0,0,0.8)" },
															}}
														>
															<EditIcon />
														</IconButton>
													</>
												)}
											</IconContainer>
										</CardBody>
									</StyledCard>
								</CourseItem>
							))}
						</>
					)}
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
				</CourseContainer>
			</ContentSection>

			<Dialog open={openAddCourseDialog} onClose={handleCloseAddCourseDialog}>
				<DialogTitle>Add New Course</DialogTitle>
				<DialogContent>
					<Autocomplete
						options={departments}
						getOptionLabel={(option) => option.departmentName}
						value={newCourse.department}
						onChange={(_, newValue) =>
							handleNewCourseChange("department", newValue)
						}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select Department"
								fullWidth
								sx={{ mt: 2 }}
							/>
						)}
					/>

					<Autocomplete
						options={courseList}
						getOptionLabel={(option) => `${option.courseCode}: ${option.courseName}`}
						value={newCourse.course}
						onChange={(_, newValue) =>
							handleNewCourseChange("course", newValue)
						}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select Course"
								fullWidth
								sx={{ mt: 2 }}
							/>
						)}
					/>

					<TextField
						fullWidth
						label="Course Capacity"
						type="number"
						value={newCourse.capacity}
						onChange={(e) => handleNewCourseChange("capacity", e.target.value)}
						sx={{ mt: 2 }}
					/>

					<Box sx={{ mt: 2 }}>
						{days.map((day) => (
							<FormControlLabel
								key={day}
								control={
									<Checkbox
										checked={newCourse.days.includes(day)}
										onChange={(e) => {
											let newDays;
											if (e.target.checked) {
												newDays = [...newCourse.days, day];
											} else {
												newDays = newCourse.days.filter((d) => d !== day);
											}
											// Sort the days according to their order in the 'days' array
											newDays.sort((a, b) => days.indexOf(a) - days.indexOf(b));
											handleNewCourseChange("days", newDays);
										}}
									/>
								}
								label={day}
							/>
						))}
					</Box>

					<TextField
						fullWidth
						label="Start Time"
						type="time"
						value={newCourse.startTime}
						onChange={(e) => handleNewCourseChange("startTime", e.target.value)}
						InputLabelProps={{ shrink: true }}
						inputProps={{ step: 300 }}
						sx={{ mt: 2 }}
					/>

					<TextField
						fullWidth
						label="End Time"
						type="time"
						value={newCourse.endTime}
						onChange={(e) => handleNewCourseChange("endTime", e.target.value)}
						InputLabelProps={{ shrink: true }}
						inputProps={{ step: 300 }}
						sx={{ mt: 2 }}
					/>

					<Select
						fullWidth
						value={newCourse.semester}
						onChange={(e) => handleNewCourseChange("semester", e.target.value)}
						displayEmpty
						sx={{ mt: 2 }}
					>
						<MenuItem value="" disabled>
							Select Semester
						</MenuItem>
						{semesters.map((sem) => (
							<MenuItem key={sem} value={sem}>
								{sem}
							</MenuItem>
						))}
					</Select>

					<TextField
						fullWidth
						label="Year"
						type="number"
						value={newCourse.year}
						onChange={(e) => handleNewCourseChange("year", e.target.value)}
						sx={{ mt: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseAddCourseDialog}>Cancel</Button>
					<Button
						onClick={handleSaveNewCourse}
						variant="contained"
						color="primary"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={openEditCourseDialog} onClose={handleCloseEditCourseDialog}>
				<DialogTitle>Edit Course</DialogTitle>
				<DialogContent>
					{editingCourse && (
						<>
							<TextField
								fullWidth
								label="Course Name"
								value={editingCourse.name}
								onChange={(e) => handleEditCourseChange("name", e.target.value)}
								sx={{ mt: 2 }}
								disabled
							/>
							<TextField
								fullWidth
								label="Course Capacity"
								type="number"
								value={editingCourse.capacity}
								onChange={(e) => handleEditCourseChange("capacity", e.target.value)}
								sx={{ mt: 2 }}
							/>
							<Box sx={{ mt: 2 }}>
								{days.map((day) => (
									<FormControlLabel
										key={day}
										control={
											<Checkbox
												checked={editingCourse.days.includes(day)}
												onChange={(e) => {
													let newDays;
													if (e.target.checked) {
														newDays = [...editingCourse.days, day];
														newDays.sort(
															(a, b) => days.indexOf(a) - days.indexOf(b),
														);
													} else {
														newDays = editingCourse.days.filter(
															(d) => d !== day,
														);
													}
													handleEditCourseChange("days", newDays);
												}}
											/>
										}
										label={day}
									/>
								))}
							</Box>
							<TextField
								fullWidth
								label="Start Time"
								type="time"
								value={editingCourse.startTime}
								onChange={(e) =>
									handleEditCourseChange("startTime", e.target.value)
								}
								InputLabelProps={{ shrink: true }}
								inputProps={{ step: 300 }}
								sx={{ mt: 2 }}
							/>
							<TextField
								fullWidth
								label="End Time"
								type="time"
								value={editingCourse.endTime}
								onChange={(e) =>
									handleEditCourseChange("endTime", e.target.value)
								}
								InputLabelProps={{ shrink: true }}
								inputProps={{ step: 300 }}
								sx={{ mt: 2 }}
							/>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseEditCourseDialog}>Cancel</Button>
					<Button
						onClick={handleSaveEditedCourse}
						variant="contained"
						color="primary"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default CourseScreen;
