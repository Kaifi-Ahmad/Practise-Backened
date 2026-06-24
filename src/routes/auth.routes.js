import { Router } from "express";
import {
  changePassword,
  getUser,
  getUserChannelProfile,
  getWatchHistory,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAvatar,
  updateCoverImage,
  updateDetails,
  userEmailVerification,
  userLogin,
} from "../controllers/auth.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  loginUserValidation,
  registerUserValidator,
} from "../validators/index.validators.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validation } from "../middleware/validator.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUserValidator(),
  validation,
  registerUser
);

router.route("/login").post(loginUserValidation(), validation, userLogin);
router
  .route("/verify-email/:verificationToken")
  .get(validation, userEmailVerification);
router.route("/refresh-token").post(validation, refreshAccessToken);
// secure Routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/getUser").get(verifyJwt, getUser);
router.route("/change-password").post(verifyJwt, changePassword);
router.route("/update-details").patch(verifyJwt, updateDetails);
router
  .route("/update-avatar")
  .patch(verifyJwt, upload.single("avatar"), updateAvatar);
router
  .route("/update-coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateCoverImage);
router.route("/getChannel/:username").get(verifyJwt, getUserChannelProfile);
router.route("/getWatchHistory").get(verifyJwt, getWatchHistory);
export default router;
