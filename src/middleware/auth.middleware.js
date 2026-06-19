import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"

const verifyJwt=asyncHandler (async (req,res,next) => {
try {
        const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized Access")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRETE)
      const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
      if(!user){
        throw new ApiError(409,"Request is not valid")
      }
      req.user=user
      next();
} catch (error) {
    throw new ApiError(401,error?.message||"Invalid Access Token")
}
})

export {verifyJwt}