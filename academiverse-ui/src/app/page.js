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
} from "@mui/icons-material";
import { fetchInstructCourses } from "./services/instructService";
const StyledCard = styled(Card)(({ theme, bgcolor }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	transition: "all 0.3s ease-in-out",
	backgroundColor: bgcolor,
	boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
	borderRadius: "12px",
	overflow: "hidden",
	"&:hover": {
		transform: "translateY(-5px)",
		boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
		cursor: "pointer",
	},
}));

const CardHeader = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	background:
		"linear-gradient(45deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)",
	borderBottom: "1px solid rgba(0,0,0,0.1)",
}));

const CardBody = styled(CardContent)(({ theme }) => ({
	flexGrow: 1,
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	background:
		"linear-gradient(45deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)",
	color: "black",
}));

const IconContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "center",
	flexWrap: "wrap",
	marginTop: theme.spacing(2),
}));

const CourseContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexWrap: "wrap",
	gap: theme.spacing(3),
}));

const CourseItem = styled(Box)(({ theme }) => ({
	flexBasis: "calc(33.333% - ${theme.spacing(2)})",
	[theme.breakpoints.down("md")]: {
		flexBasis: "calc(50% - ${theme.spacing(2)})",
	},
	[theme.breakpoints.down("sm")]: {
		flexBasis: "100%",
	},
}));

const TitleSection = styled(Box)(({ theme }) => ({
	height: "15vh",
	width: "100%",
	background: "linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	padding: theme.spacing(0, 4),
}));

const ContentSection = styled(Box)(({ theme }) => ({
	height: "85vh",
	width: "100%",
	padding: theme.spacing(3),
	overflowY: "auto",
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

	useEffect(() => {
		// Simulating API calls with static data
		const staticDepartments = [
			{ id: "CS", name: "Computer Science" },
			{ id: "MATH", name: "Mathematics" },
			{ id: "ENG", name: "English" },
		];
		const staticCourseList = [
			{ id: "CS101", code: "CS101", title: "Introduction to Programming" },
			{ id: "CS201", code: "CS201", title: "Data Structures" },
			{ id: "MATH101", code: "MATH101", title: "Calculus I" },
		];

		const professorEnrolledCourses = async () => {
			const res = await fetchInstructCourses(
				session.userDetails?.userId,
				"2024",
				"Fall",
				session.id_token,
			);
			if (res) {
				const mappedCourses = res.data.map((course) => ({
					id: course.course.courseId,
					code: course.course.courseCode,
					name: course.course.courseName,
					color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
					days: course.courseDays
						? course.courseDays.split(",").map((day) => day.trim())
						: [],
					startTime: course.courseStartTime,
					endTime: course.courseEndTime,
				}));
				setCourses(mappedCourses);
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
		professorEnrolledCourses();
		setDepartments(staticDepartments);
		setCourseList(staticCourseList);
		setLoading(false);
	}, []);

	const handleCourseClick = (courseId) => {
		setSelectedCourseId(courseId);
		router.push(`/courses?id=${courseId}&section=announcements`);
	};

	const handleAddCourse = () => {
		setOpenAddCourseDialog(true);
	};

	const handleCloseAddCourseDialog = () => {
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

	const handleSaveNewCourse = () => {
		// Add the new course to the static data
		const newCourseData = {
			id: courses.length + 1,
			code: newCourse.course.code,
			name: newCourse.course.title,
			color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
			days: newCourse.days,
			startTime: newCourse.startTime,
			endTime: newCourse.endTime,
		};
		setCourses([...courses, newCourseData]);
		handleCloseAddCourseDialog();
	};

	const handleNewCourseChange = (field, value) => {
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

	const handleSaveEditedCourse = () => {
		const updatedCourses = courses.map((course) =>
			course.id === editingCourse.id ? editingCourse : course,
		);
		setCourses(updatedCourses);
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
				<Typography
					variant="h4"
					sx={{
						color: "white",
						fontWeight: "bold",
						textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
					}}
				>
					My Academic Journey
				</Typography>
			</TitleSection>
			<ContentSection>
				{isProfessor && (
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-end",
							marginBottom: 2,
							paddingRight: 2,
						}}
					>
						<Button
							variant="contained"
							color="primary"
							startIcon={<AddIcon />}
							onClick={handleAddCourse}
							sx={{
								backgroundColor: "#4CAF50",
								"&:hover": { backgroundColor: "#45a049" },
								maxWidth: "calc(100% - 16px)",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							Add Course
						</Button>
					</Box>
				)}
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
				</CourseContainer>
			</ContentSection>

			<Dialog open={openAddCourseDialog} onClose={handleCloseAddCourseDialog}>
				<DialogTitle>Add New Course</DialogTitle>
				<DialogContent>
					<Autocomplete
						options={departments}
						getOptionLabel={(option) => option.name}
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
						getOptionLabel={(option) => `${option.code}: ${option.title}`}
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
