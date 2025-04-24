import { Router } from "express";
import { sendEmergencyAlert } from "../controller/emergency.controller.js";
import { verifyJWT } from "../Middleware/Auth.js";

const router = Router();

// Protected emergency route
router.route("/send-alert")
  .post( sendEmergencyAlert);

export default router;