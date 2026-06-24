import mongoose,{Schema} from "mongoose";
import { taskStatusEnum,availableTaskStatus } from "../utils/constant.js";

const userTaskSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    assignedBy:{
         type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:availableTaskStatus,
        default:taskStatusEnum.TODO
    },
    attachment:{
        type:[{
            url:String,
            mimetype:String,
            size:Number
        }],
        default:[]
    }
},{
    timestamps:true
})

export const Task=mongoose.model("Task",userTaskSchema)