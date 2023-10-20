import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { isEmpty, validate } from "class-validator";
import { mapError, uploadImage } from "../utils/helpers";
import bcrypt from "bcryptjs"; // 비밀번호 암호화
import jwt from "jsonwebtoken"; // 로그인 토큰
import cookie from "cookie";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
import { unlinkSync } from "fs";
import Sub from "../entities/Sub";

/* 라우터 설정 */

// 인증처리
const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

// 이미지 업로드
const uploadPostImage = async (req: Request, res: Response) => {
  try {
    const type = req.body.type;
    // 파일 유형을 지정치 않았을 시에는 업로드 된 파일 삭제
    if (type !== "post") {
      if (!req.file?.path) {
        return res.status(400).json({ error: "유효하지 않는 파일" });
      }

      // 파일을 지워주기
      unlinkSync(req.file.path);
      return res.status(400).json({ error: "잘못된 유형" });
    }

    return res.json(req.file?.filename);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// 회원가입
const register = async (req: Request, res: Response) => {
  const { email, username, password, imageUrn } = req.body;

  try {
    let errors: any = {};
    console.log(imageUrn);
    if (email.trim() === "") errors.email = "이메일을 입력해 주세요";
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
    user.userImageUrn = imageUrn;
    user.isApproved = false;
    user.approvalRequsts = [];
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

// 로그아웃
const logout = async (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );
  res.status(200).json({ success: true });
};

// 승인요청 보내기
const requestApproval = async (req: Request, res: Response) => {
  const username = req.params.userId;
  const requesterUserIds = req.body.requesterUserId;

  try {
    const user = await User.findOneByOrFail({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (res.locals.user) {
      const approvalSameCheck = user.approvalRequsts.some(
        (el) => el === requesterUserIds
      );
      if (approvalSameCheck)
        return res.status(404).json({ message: "이미 가입 신청 하였습니다." });
    }
    user.approvalRequsts.push(requesterUserIds);

    await user.save();
    // console.log(user, "asdasd");
    return res.json({ message: "Approval request sent", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error sending approval request", error });
  }
};

// 승인 수락
const approval = async (req: Request, res: Response) => {
  const username = req.params.userId;
  console.log(username, "유저네임");

  try {
    const user: User = res.locals.user;
    // const user = await User.findOneByOrFail({ username });
    const sub = await Sub.findOneByOrFail({ username: user.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user) {
      // 승인 처리: isApproved 값을 true로 설정
      user.isApproved = true;

      // 승인 요청 목록에서 요청을 삭제
      user.approvalRequsts = user.approvalRequsts.filter(
        (requesterId) => requesterId !== username
      );
    }

    sub.subMember.push(username);
    console.log(sub);

    await sub.save();
    await user.save();

    return res.json({ message: "User approved" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error approving user" });
  }
};

const router = Router();
router.get("/me", userMiddleware, authMiddleware, me);
router.post("/upload", uploadImage.single("file"), uploadPostImage);
router.post("/register", register);
router.post("/register/upload", register);
router.post("/login", login);
router.post("/logout", userMiddleware, authMiddleware, logout);
router.put("/:userId/request-approval", userMiddleware, requestApproval);
router.put("/:userId/approve", userMiddleware, approval);
export default router;
