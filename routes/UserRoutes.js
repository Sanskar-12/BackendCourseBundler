import express from "express";
import { AddtoPlaylist, DeleteMyProfile, DeleteUser, Updaterole, changePassword, forgetPassword, getAllUsers, getMyProfile, login, logout, register, removeFromPlaylist, resetPassword, updateProfile, updateProfilepicture } from "../controllers/userController.js";
import {adminAuth, isAuthenticated} from "../middlewares/auth.js"
import singleUpload from "../middlewares/multer.js";

const router=express.Router()

//User Routes

//Register a new User
router.post("/register",singleUpload,register)

//Login
router.post("/login",login)

//Logout
router.get("/logout",logout)

//Get User profile
router.get("/me",isAuthenticated,getMyProfile)

//Delete Profile
router.delete("/me/deleteprofile",isAuthenticated,DeleteMyProfile)

//Change password
router.put("/changepassword",isAuthenticated,changePassword)

//Update Profile
router.put("/updateprofile",isAuthenticated,updateProfile)

//Update profile Picture
router.put("/updatepfp",isAuthenticated,singleUpload,updateProfilepicture)

//Forget Password
router.post("/forgetpassword",forgetPassword)

//Reset Password
router.put("/resetpassword/:token",resetPassword)

//Add to Playlist
router.post("/addtoplaylist",isAuthenticated,AddtoPlaylist)

//Remove from Playlist
router.delete("/deletefromplaylist",isAuthenticated,removeFromPlaylist)

//Admin Routes

//Get all Users
router.get("/admin/getusers",isAuthenticated,adminAuth,getAllUsers)

//Update Role
router.put("/admin/updaterole/:id",isAuthenticated,adminAuth,Updaterole)

//Delete User
router.delete("/admin/deleteuser/:id",isAuthenticated,adminAuth,DeleteUser)



export default router