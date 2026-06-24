import mongoose,{Schema} from "mongoose";


const subTaskSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    task:{
        type:Schema.Types.ObjectId,
        ref:"Task"
    },
    assignedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

export const SubTask=mongoose.model("SubTask",subTaskSchema)