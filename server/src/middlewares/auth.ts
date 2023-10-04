import { User } from "../entities/User";
import { NextFunction, Request, Response, Router } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res?.locals?.user;

    if (!user) throw new Error("유져정보가 없습니다.");

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Someting error" });
  }
};
