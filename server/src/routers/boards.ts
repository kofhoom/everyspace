import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
/* 라우터 설정 */
const createSub = async (req: Request, res: Response, next) => {
  const [name, title, description] = req.body;

  // 유져 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크

  // sub instance 생성 수 데이터베이스에 저장

  // 저장한 정보 프론트엔드로 전달해주기
};

// 커뮤니티 생성
const router = Router();

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
