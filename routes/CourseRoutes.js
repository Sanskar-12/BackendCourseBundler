import express from "express";
import { CreateCourse, DeleteCourse, DeleteLecture, addLectures, getAllCourses, getCourseLectures } from "../controllers/courseControllers.js";
import singleUpload from "../middlewares/multer.js";
import { AuthSubscribers, adminAuth, isAuthenticated } from "../middlewares/auth.js";

const router=express.Router()


//get all Courses
router.get("/courses",getAllCourses)

//Create Courses - only admin
router.post("/createcourses",isAuthenticated,adminAuth,singleUpload,CreateCourse)

//Get all course lectures
router.get("/course/:id",isAuthenticated,AuthSubscribers,getCourseLectures)

//Add Lectures
router.post("/course/:id",isAuthenticated,adminAuth,singleUpload,addLectures)

//Delete Course
router.delete("/course/:id",isAuthenticated,adminAuth,DeleteCourse)

//Delete Lecture
router.delete("/lecture",isAuthenticated,adminAuth,DeleteLecture)
export default router;