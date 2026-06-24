import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import mongoose from "mongoose";
import { availableUserRole, userRoleEnum } from "../utils/constant.js";

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw new ApiError(400, "Both fields are required");
  }
  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });
  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    roles: userRoleEnum.ADMIN,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project created successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;
  if (!name && !description) {
    throw new ApiError(400, "One field are required");
  }
  if (!projectId) {
    throw new ApiError(400, "Project Id is required");
  }
  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $set: updateData },
    { new: true }
  );
  if (!project) {
    throw new ApiError(409, "Project not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project Updated Successfully"));
});
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Project Id is required");
  }
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(409, "Project not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project Deleted Successfully"));
});

const getProject = asyncHandler(async (req, res) => {
  const project = await ProjectMember.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projects",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$projects",
    },
    {
      $project: {
        projects: {
          _id: 1,
          name: 1,
          description: 1,
          createdBy: 1,
          members: 1,
        },
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project Fetched Successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched Successfully"));
});

const addMemberToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  if (!email || !role) {
    throw new ApiError(400, "Both fields are required");
  }
  if (!projectId) {
    throw new ApiError(400, "Project Id is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(409, "User does not exist");
  }
  ProjectMember.findOneAndUpdate(
    {
      user: user._id,
      project: projectId,
    },
    {
      user: user._id,
      project: projectId,
      role: role,
    },
    {
      new: true,
      upsert: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project members added successFully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(409, "Project not found");
  }
  const projectMember = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $first: "$user",
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        createdAt: 1,
        updatedAt: 1,
        role: 1,
        _id: 0,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, projectMember, "Member fetched Successfully"));
});
const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;
  if (!availableUserRole.includes(newRole)) {
    throw new ApiError(422, "Role is invalid");
  }
  const projectMember = await ProjectMember.findOneAndUpdate(
    {
      project: projectId,
      user: userId,
    },
    {
      role: newRole,
    },
    {
      new: true,
    }
  );
  if (!projectMember) {
    throw new ApiError(409, "Project member not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, projectMember, "Role Update SuccessFully"));
});
const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const projectMember = await ProjectMember.findOneAndDelete({
    project: projectId,
    user: userId,
  });
  if (!projectMember) {
    throw new ApiError(409, "Project member not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, projectMember, "Member Deleted SuccessFully"));
});
export {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getProjectById,
  getProjectMembers,
  updateMemberRole,
  deleteMember,
  addMemberToProject
};
