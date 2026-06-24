import { ApiError } from "../utils/api-error.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { asyncHandler } from "../utils/async-handler.js";

export const validateProjectPermission=(roles=[]) => 
    asyncHandler(async (req,res,next) => {
        const {projectId}=req.params
        if(!projectId){
            throw new ApiError(400,"Project Id is required")
        }
        const project=await ProjectMember.findOne({
            project:projectId,
            user:req.user._id
        })
              if(!project){
            throw new ApiError(404 ,"Project not found")
        }
       const givenRole=project?.roles
       req.user.role=givenRole
       
       if(!roles.includes(givenRole)){
        throw new ApiError(422,"You have not permission to do this task")
       }
       next()
    })
