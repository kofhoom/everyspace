import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { NextFunction, Request, Response, Router } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  유져인지 체크를 위해 유저 정보 가져오기 (요청에서 보내주는 토큰을 이용)
    // cokie처리
    const token = req.cookies.token;
    // userMiddleware에서 유저 정보 잘 가져오는지 체크
    if (!token) return next();

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOneBy({ username });
    // 유져 정보가 없다면 throw error!
    if (!user) throw new Error("유져정보가 없습니다.");

    // 유져 정보를 res.local.user에 넣어주기
    res.locals.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Someting error" });
  }
};
