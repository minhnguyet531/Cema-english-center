import express from "express";
import {
    addLecture,
    createCourse,
    deleteCourse,
    deleteLecture,
    getAllCourse,
    getCourseLecture,
} from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Get All Courses without Lectures
router.route("/courses").get(getAllCourse);

// Create new course - only Admin
router.route("/createcourse").post(createCourse);
// router
//     .route("/createcourse")
//     .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

// Get Course Details
router.route("/course/:id").get(isAuthenticated, getCourseLecture);

// Add Lecture
router
    .route("/course/:id")
    .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture);

// Delete Course
router
    .route("/course/:id")
    .delete(isAuthenticated, authorizeAdmin, deleteCourse);

// Delete Lecture
router.route("/lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);

export default router;
