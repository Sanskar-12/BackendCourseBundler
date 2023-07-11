import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { getDatauri } from "../utils/dataUri.js";
import { Stats } from "../models/Stats.js";


export const getAllCourses = catchAsyncError(async (req, res, next) => {
  const keyword=req.query.keyword || ""
  const category=req.query.category || ""
  const courses = await Course.find({
    title:{
      $regex:keyword,
      $options:"i"
    },
    category:{
      $regex:category,
      $options:"i"
    }
  }).select("-lectures");
  res.status(200).json({
    success: true,
    courses: courses,
  });
});

export const CreateCourse = catchAsyncError(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new ErrorHandler("Please add all fields", 400));
  }

  const file = req.file;
  const fileUri = getDatauri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Course has been created you can now add Courses",
  });
});

export const getCourseLectures = catchAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 400));
  }

  course.views = course.views + 1;

  await course.save();
  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});

export const addLectures = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;

  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 400));
  }

  const file = req.file;
  const fileUri = getDatauri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
  });

  course.lectures.push({
    title,
    description,
    video: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  course.numOfVideos = course.lectures.length;

  await course.save();
  res.status(200).json({
    success: true,
    message: "Lecture added in Course",
  });
});

export const DeleteCourse = catchAsyncError(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not found", 400));
  }

  await cloudinary.v2.uploader.destroy(course.poster.public_id);

  for (let i = 0; i < course.lectures.length; i++) {
    const singleUpload = course.lectures[i];
    await cloudinary.v2.uploader.destroy(singleUpload.video.public_id, {
      resource_type: "video",
    });
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course removed",
  });
});

export const DeleteLecture = catchAsyncError(async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  let course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorHandler("Course not found", 400));
  }

  const lecture = course.lectures.find((item) => {
    if (item._id.toString() === lectureId.toString()) {
      return item;
    }
  });

  await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
    resource_type: "video",
  });

  course.lectures = course.lectures.filter((item) => {
    if (item._id.toString() !== lectureId.toString()) {
      return item;
    }
  });

  course.numOfVideos = course.lectures.length;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture removed",
  });
});

Course.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

  let Totalviews = 0;

  const courses = await Course.find({});

  for (let i = 0; i < courses.length; i++) {
    Totalviews = Totalviews + courses[i].views;
  }

  stats[0].views = Totalviews;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});
