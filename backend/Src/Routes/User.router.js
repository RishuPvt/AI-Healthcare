import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  userDetails,
  updateUserAvatar,
} from "../controller/User.controller.js";
import { upload } from "../Middleware/multer.middleware.js";
import { verifyJWT } from "../Middleware/Auth.js";
import { Router } from "express";

const router = Router();

router.route("/RegisterUser").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/getCurrentUser").get(verifyJWT, currentUser);

router
  .route("/userDetails")
  .post(verifyJWT, upload.single("report"), userDetails);

router
  .route("/updateUserAvatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

  
  export default router