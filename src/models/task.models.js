import mongoose,{Schema} from "mongoose";
import { taskStatusEnum,availableTaskStatus } from "../utils/constant.js";

const userTaskSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    assignedBy:{
         type:Schema.Types.ObjectId,
        ref:"User",
    },
    status:{
        type:String,
        enum:availableTaskStatus,
        default:taskStatusEnum.TODO
    },
},{
    timestamps:true
})

export const Task=mongoose.model("Task",userTaskSchema)