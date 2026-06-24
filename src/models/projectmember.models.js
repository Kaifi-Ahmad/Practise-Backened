import mongoose,{Schema} from "mongoose";
import { availableUserRole, userRoleEnum } from "../utils/constant.js";

const projectMemberSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    roles:{
        type:String,
        enum:availableUserRole,
        default:userRoleEnum.MEMBER
    }
},{
    timestamps:true
})

export const ProjectMember=mongoose.model("ProjectMember",projectMemberSchema)