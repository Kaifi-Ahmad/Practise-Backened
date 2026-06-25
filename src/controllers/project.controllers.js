import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
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
  const projectMember=await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    roles: userRoleEnum.ADMIN,
  });
  console.log(project._id);
  console.log(projectMember._id);
  
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
    { $set: {...updateData }},
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
  await ProjectMember.findOneAndUpdate(
    {
      user: user._id,
      project: projectId,
    },
    {
      user: user._id,
      project: projectId,
      roles: role,
    },
    {
      returnDocument:"after",
      upsert: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project members added successFully"));
});
const getProjectMembers = asyncHandler(async (req, res) => {
  const {projectId}=req.params
  if(!projectId){
    throw new ApiError(422,"Project Id is required")
  }
const projectMembers = await ProjectMember.find({
  project: projectId,
})
.populate({
  path: "user",
  select: "_id username fullName avatar"
})
.select("project user role createdAt updatedAt");
  return res
    .status(200)
    .json(new ApiResponse(200, projectMembers, "Member fetched Successfully"));
});
const updateMemberRole = asyncHandler(async (req, res) => {
  console.log("Controller reached");
console.log(req.body);
  const { projectId, userId } = req.params;

  const { newRole } = req.body;
  if (!availableUserRole.includes(newRole)) {
    throw new ApiError(422, "Role is invalid");
  }
  const projectMember = await ProjectMember.findOneAndUpdate(
    {
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(userId),
    },
    {
      roles: newRole,
    },
    {
      returnDocument: "after",
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
