import { Request, Response, NextFunction } from "express";

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({ error: "Admins only" });
      return;
    }

    next(); // OK
  } catch (err) {
    console.error("verifyAdmin error:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
}
