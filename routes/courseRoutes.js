import express from "express";
import {
    addLecture,
    createCourse,
    deleteCourse,
    deleteLecture,
    getAllCourse,
    getCourseLectures,
} from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Get All Courses without Lectures
router.route("/").get(getAllCourse);

// Create new course - only Admin
router
    .route("/createcourse")
    .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

// Delete Lecture
router.route("/lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);

// Get Course Details, Add Lecture, Delete Course
router
    .route("/:id")
    .get(isAuthenticated, getCourseLectures)
    .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
    .delete(isAuthenticated, authorizeAdmin, deleteCourse);

// router.route("/course/:id").get(isAuthenticated, getCourseLectures);

// // Add Lecture
// router
//     .route("/course/:id")
//     .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture);

// // Delete Course
// router
//     .route("/course/:id")
//     .delete(isAuthenticated, authorizeAdmin, deleteCourse);

// Delete Lecture
// router.route("/lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);

export default router;
