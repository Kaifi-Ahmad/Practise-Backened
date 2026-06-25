import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import mongoose from "mongoose";
import { availableTaskStatus, taskStatusEnum } from "../utils/constant.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(402, "Project not found");
  }
  const task = await Task.create({
    title,
    description,
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    project: projectId,
    status,
    assignedBy: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(402, "Project not found");
  }
  const tasks = await Task.find({
   project: projectId,
  }).populate("assignedTo", "avatar email fullName");
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const {taskId,projectId}=req.params
  if(!availableTaskStatus.includes(status)){
    throw new ApiError(400,"Invalid Status")
  }
  if ((!title && !description && !status) || !taskId||!projectId) {
    throw new ApiError(
      400,
      "Task ID and Project ID is required And above the fields one field is required"
    );
  }
  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (status) updateData.status = status;
  const task = await Task.findOneAndUpdate(
    {
        _id:taskId,
        project:projectId
    },
    {
      $set: updateData,
    },
    {
      returnDocument: "after",
    }
  );
  if (!task) {
    throw new ApiError(409, "Project not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task update Successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId,projectId } = req.params;
  if (!taskId||!projectId) {
    throw new ApiError(400, "Task ID and Project ID is required");
  }
  const task = await Task.findOneAndDelete({
    _id:taskId,
    project:projectId
  });
  if (!task) {
    throw new ApiError(409, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task Deleted Successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { projectId, taskId } = req.params;
  if (!title || !projectId || !taskId) {
    throw new ApiError(400, "All fields are required");
  }
  const project = await Task.findOne({
    project: projectId,
    _id: taskId,
  });
  if (!project) {
    throw new ApiError(409, "Task not found");
  }
  const subtask = await SubTask.create({
    title,
    assignedBy: req.user._id,
    task: taskId,
  });
  if (!subtask) {
    throw new ApiError(422, "Error in creating the subTask");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "SubTask Create SuccessFully"));
});
const updateSubTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { taskId, subTaskId,projectId } = req.params;
  if (!title || !taskId || !subTaskId||!projectId) {
    throw new ApiError(400, "All fields are required");
  }
  const task = await Task.findOne({
  _id: taskId,
  project: projectId
});

if (!task) {
  throw new ApiError(404, "Task not found in project");
}
  const subTask = await SubTask.findOneAndUpdate(
    {
      _id: subTaskId,
      task: taskId,
    },
    {
      title,
    },
    {
      returnDocument: "after",
    }
  );
  if (!subTask) {
    throw new ApiError(404, "SubTask not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "SubTask Update SuccessFully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { taskId, subTaskId ,projectId} = req.params;
  if (!taskId || !subTaskId||!projectId) {
    throw new ApiError(400, "All fields are required");
  }
  const task = await Task.findOne({
  _id: taskId,
  project: projectId
});

if (!task) {
  throw new ApiError(404, "Task not found in project");
}
  const subTask = await SubTask.findOneAndDelete({
    _id: subTaskId,
    task: taskId,
  });
  if (!subTask) {
    throw new ApiError(404, "SubTask not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "SubTask Deleted SuccessFully"));
});
export {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
};
