import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { isEmpty, validate } from "class-validator";
import { mapError } from "../utils/helpers";
import bcrypt from "bcryptjs"; // 비밀번호 암호화
import jwt from "jsonwebtoken"; // 로그인 토큰
import cookie from "cookie";

/* 라우터 설정 */

// 회원가입
const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    // 이메일과 유저이름이 이미 저장 사용되고 있는 것인지 확인.
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 이미 있다면 errors 객체에 넣어줌.
    if (emailUser) errors.email = "이미 해당 이메일 주소가 사용되었습니다.";
    if (usernameUser)
      errors.username = "이미 해당 사용자 이름이 사용되었습니다.";

    // 에러가 있다면 return으로 에러를 response 보내줌.
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 정해 놓은 조건으로 user 데이터의 유효성 검사를 해줌.
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));

    // 유져 정보를 user table에 저장
    await user.save();
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

// 로그인
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    //비워져 있다면 에러를 프론트엔드로 보내주기
    if (isEmpty(username)) errors.username = "사용자 이름을 입력해주세요.";
    if (isEmpty(password)) errors.password = "비밀번호를 입력해주세요.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //디비에서 유져 찾기
    const user = await User.findOneBy({ username });

    if (!user)
      return res
        .status(404)
        .json({ username: "사용자 이름이 등록되지 않았습니다." });

    // 유져가 있다면 비밀번호 비교하기
    const passwordMatches = await bcrypt.compare(password, user.password);

    // 비밀번호가 다르다면 에러 보내기
    if (!passwordMatches) {
      return res.status(401).json({ password: "비밀번호가 잘못되었습니다." });
    }

    // 비밀번호가 맞다면 토근 생성
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    // 쿠키저장 & 보안 설정
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true, // 자바스크립트 에서 쿠키를 사용할 수 없게 설정
        secure: process.env.NODE_ENV === "production", //https 연결에서 쿠키를 사용 할 수 있게 설정
        sameSite: "strict", // 외부 사이트에서 요청시 브라우자가 쿠리를 보내지 못하도록 막아줌 (xsrf공격 방어)
        maxAge: 60 * 60 * 24 * 7, // 쿠키 저장시간 1week
        path: "/",
      })
    );
    return res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.post("/register", register);
router.post("/login", login);

export default router;
