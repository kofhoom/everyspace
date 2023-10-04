import { Request, Response, Router } from "express";
import { isEmpty, validate } from "class-validator";
import { mapError } from "../utils/helpers";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

/* 라우터 설정 */
const createSub = async (req: Request, res: Response, next) => {
  const [name, title, description] = req.body;
  // 먼저 커뮤니티를 생성할 수 있는 유져인지 체크를 위해 유저 정보 가져오기 (요청에서 보내주는 토큰을 이용)
  const token = req.cookies.token;

  if (!token) return next();

  const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOneBy({ username });

  // 유져 정보가 없다면 throw error!
  if (!user) throw new Error("유져정보가 없습니다.");

  // 유져 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크

  // sub instance 생성 수 데이터베이스에 저장

  // 저장한 정보 프론트엔드로 전달해주기
};

// 커뮤니티 생성
const router = Router();

router.post("/", createSub);

export default router;
