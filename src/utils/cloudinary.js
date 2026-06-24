import { v2 as cloudinary } from "cloudinary";

import fs from "fs"
import {ApiError} from "./api-error.js"


export const configureCloudnary=async()=>{
await cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

}

// console.log({
//      cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_API_SECRET

// })

const uploadOnCloudnary=async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localFilePath)
        return null
    }
}
const deleteFromCloudinary=async (publicId) => {
    try {
        const deleteResult=await cloudinary.uploader.destroy(publicId)
        return deleteFromCloudinary        
    } catch (error) {
        throw new ApiError(409,"Failed to delete file from cloudinary")
    }
}

export {uploadOnCloudnary,deleteFromCloudinary}