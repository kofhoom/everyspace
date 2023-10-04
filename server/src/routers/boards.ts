import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
import { isEmpty } from "class-validator";
import { AppDataSource } from "../data-source";
import Sub from "../entities/Sub";
import { User } from "../entities/User";
/* 라우터 설정 */
const createBoard = async (req: Request, res: Response, next) => {
  const [name, title, description] = req.body;
  try {
    // 유져 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크
    let errors: any = {};
    if (isEmpty(name)) errors.name = "이름은 비워둘 수 없습니다.";
    if (isEmpty(title)) errors.title = "제목은 비워둘 수 없습니다.";

    const sub = await AppDataSource.getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name)= :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "이름이 존제합니다.";
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
    // sub instance 생성 수 데이터베이스에 저장

    // 저장한 정보 프론트엔드로 전달해주기
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }

  try {
    const user: User = res.locals.user;
    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;

    await sub.save();
    return res.json(sub);
  } catch (error) {
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

// 커뮤니티 생성
const router = Router();

router.post("/", userMiddleware, authMiddleware, createBoard);

export default router;
