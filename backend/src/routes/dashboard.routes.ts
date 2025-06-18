import express from "express";
import { getAdminDashboardData } from "../controllers/dashboard.controller";
import { verifyFirebaseToken } from "../middlewares/auth.middleware";
import { verifyAdmin } from "../middlewares/admin.middle";
import { deleteUserByUid } from "../controllers/dashboard.controller";

const router = express.Router();

// Chỉ admin được xem dashboard
router.get("/admin/users", verifyFirebaseToken, verifyAdmin, getAdminDashboardData);
router.delete("/admin/users/:uid", verifyFirebaseToken, verifyAdmin, deleteUserByUid);

export default router;