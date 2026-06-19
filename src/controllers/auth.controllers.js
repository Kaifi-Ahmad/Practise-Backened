import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { emailVerificationMailgenContent, sendMail } from "../utils/mail.js";
import crypto from "crypto"

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new ApiError(409, "User Already exist");
  }
  const avatarLocalStorage = req.files?.avatar?.[0]?.path;
  const coverImageLoacalStorage = req.files?.coverImage?.[0]?.path;
  if (!avatarLocalStorage) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudnary(avatarLocalStorage);
  const coverImage = await uploadOnCloudnary(coverImageLoacalStorage);
  if (!avatar) {
    throw new ApiError(409, "Avatar is required");
  }
  const user = await User.create({
    email,
    password,
    username,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    fullName,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });
  await sendMail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v2/users/verify-email/${unHashedToken}`
    ),
  });
  console.log(unHashedToken);
  
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something Went Wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User register Successfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(409, "Username or email is required");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(409, "Username or email does nor exist");
  }
  const passwordValidation = await user.isPasswordCorrect(password);
  if (!passwordValidation) {
    throw new ApiError(409, "Password is not correct");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -avatar -coverImage"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User Logged in Successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { returnDocument: "after" }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out SuccessFully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingToken) {
    throw new ApiError(401, "Unauthorized Access");
  }
  try {
    const decodedToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRETE
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }
    if (incomingToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is invalid");
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Acccess Token Refreshed SuccessFully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const userEmailVerification=asyncHandler(async (req,res)=> {
  
  
  const {verificationToken}=req.params
  console.log(verificationToken);
  
  if(!verificationToken){
    throw new ApiError(422,"Verification Token is missing")
  }
  const hashedToken=crypto.createHash("sha256").update(verificationToken).digest("hex")
  const user=await User.findOne({
    emailVerificationToken:hashedToken,
    emailVerificationExpiry:{ $gt:Date.now()}
  })
  if(!user){
    throw new ApiError(402,"Token is invalid or expire")
  }

  user.emailVerificationToken=undefined
  user.emailVerificationExpiry=undefined
  user.isEmailVerified=true;
  await user.save({validateBeforeSave:false})
  return res.status(200).json(new ApiResponse(200,{isEmailVerified:true},"Email Verified SuccessFully"))
})

export { registerUser, userLogin, logoutUser, refreshAccessToken,userEmailVerification };
