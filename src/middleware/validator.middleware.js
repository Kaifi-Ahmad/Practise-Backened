import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validation=(req,res,next) => {
 const errors=validationResult(req)
 if(errors.isEmpty()){
    return next()
 }
 const extractedError=[]
 errors.array().map((err) =>extractedError.push({[err.path]:err.message}))
 throw new ApiError(422,"Received Data is not valid",extractedError)
}