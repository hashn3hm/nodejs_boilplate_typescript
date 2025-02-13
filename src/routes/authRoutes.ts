import { Router } from "express";
import {
  createProfile,
  login,
  sendOtp,
  signup,
  verifyOtp,
} from "../controllers/authController";
import { handleMediaFilesLocal } from "../utils/Mutlipart";
import { checkBearer } from "../middleware/checkBearer";

const router = Router();

router.post("/signup", checkBearer, signup);
router.post(
  "/create-profile",
  handleMediaFilesLocal.single("file"),
  createProfile
);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp", sendOtp);

export default router;

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication Flow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
