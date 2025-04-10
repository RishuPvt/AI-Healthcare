import ApiResponse from "../utility/ApiResponse.js";
import ApiError from "../utility/ApiError.js";
import { asyncHandler } from "../utility/AsyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../DB/Database.js";
import { uploadOnCloudinary , deleteOnCloudinary } from "../utility/Cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { phoneNumber, password, fullName } = req.body;

  if (!phoneNumber || !password || !fullName) {
    throw new ApiError(
      404,
      "phoneNumber and Name field is req for Registration"
    );
  }

  const existedUser = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (existedUser) {
    throw new ApiError(409, "User with phoneNumber. already exists");
  }
  const avatarLocalPath = req.file?.path;
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName,
      phoneNumber,
      password: hashedPassword,
      avatar: avatar?.url || null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Register Succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      throw new ApiError(404, "email & password is Required");
    }

    const user = await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid user password");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "User logged In Successfully", {
          id: user.id,
          fullName: user.fullName,
        })
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Authentication failed. Please try again."));
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "user not found");
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse(200, "User logged out successfully", {
          id: user.id,
        })
      );
  } catch (error) {
    console.log(error);

    throw new ApiError(500, "Error while logging out user");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ApiError(400, "User Not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, " user Logged In succesfully"));
  } catch (error) {
    throw new ApiError(400, "Somthing went wrong while current user");
  }
});

const userDetails = asyncHandler(async (req, res) => {
  const { dateOfBirth, bloodGroup, height, weight, allergies } = req.body;
  const userId = req.user.id;
  if (!dateOfBirth || !bloodGroup || !height || !weight || !allergies) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!existedUser) {
    throw new ApiError(409, "User Not exists");
  }

  const reportLocalPath = req.file?.path;
  const report = await uploadOnCloudinary(reportLocalPath);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      dateOfBirth,
      bloodGroup,
      height: parseFloat(height),
      weight: parseFloat(weight),
      allergies: Array.isArray(allergies) ? allergies : [allergies], // Ensure array format
      report: report?.url || null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User Register Succesfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  const userId = req.user?.id;
  try {
    if (!avatarLocalPath) {
      throw new ApiError(400, "avatar file is missing");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await deleteOnCloudinary(publicId);
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
      throw new ApiError(400, "Error while uploading avatar");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: avatar.url,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
  } catch (error) {
    return res.status(200)
    .json(new ApiResponse(400, "somthing went wrong while changing avatar"));
  }
});

export { registerUser, loginUser, logoutUser, currentUser, userDetails , updateUserAvatar };
