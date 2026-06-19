import { Router } from "express";
import { logoutUser, refreshAccessToken, registerUser, userEmailVerification, userLogin } from "../controllers/auth.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { loginUserValidation, registerUserValidator } from "../validators/index.validators.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validation } from "../middleware/validator.middleware.js";
const router=Router()

router.route("/register").post(upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]),registerUserValidator(),validation,registerUser)

router.route("/login").post(loginUserValidation(),validation,userLogin)
router.route("/verify-email/:verificationToken").get(userEmailVerification)
// secure Routes
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router