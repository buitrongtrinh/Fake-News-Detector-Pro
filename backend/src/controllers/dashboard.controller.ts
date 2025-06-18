import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

export const getAdminDashboardData = async (req: Request, res: Response) => {
  try {
    const usersWithHistory = await dashboardService.getAllUsersWithHistory();
    res.status(200).json(usersWithHistory);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy dữ liệu dashboard" });
  }
};


export const deleteUserByUid = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    await dashboardService.deleteUserAndData(uid);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
