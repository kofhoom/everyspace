import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { isEmpty, validate } from "class-validator";
import {
  generateTemporaryPassword,
  mapError,
  uploadImage,
} from "../utils/helpers";
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
  const { email, username, password, imageUrn, tel } = req.body;

  try {
    let errors: any = {};
    if (email.trim() === "") errors.email = "이메일을 입력해 주세요";
    // 이메일과 유저이름이 이미 저장 사용되고 있는 것인지 확인.
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 이미 있다면 errors 객체에 넣어줌.

    if (emailUser) errors.email = "이미 해당 이메일 주소가 사용되었습니다.";
    if (usernameUser)
      errors.username = "이미 해당 사용자 이름이 사용되었습니다.";
    if (tel.length !== 11) errors.tel = "전화번호는 11자리 이여야 합니다.";

    // 에러가 있다면 return으로 에러를 response 보내줌.
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    user.tel = tel;
    user.userImageUrn = imageUrn;
    user.userBannerUrn = "";
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
    if (isEmpty(username)) errors.username = "닉네임을 입력해주세요.";
    if (isEmpty(password)) errors.password = "비밀번호를 입력해주세요.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //디비에서 유져 찾기
    const user = await User.findOneBy({ username });

    if (!user)
      return res
        .status(404)
        .json({ username: "닉네임이 등록되지 않았습니다." });

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
        secure: false, //https 연결에서 쿠키를 사용 할 수 있게 설정
        // secure: process.env.NODE_ENV === "production", //https 연결에서 쿠키를 사용 할 수 있게 설정
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
      // secure: process.env.NODE_ENV === "production", //https
      secure: false,
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

  try {
    const user: User = res.locals.user;

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

    await sub.save();
    await user.save();

    return res.json({ message: "User approved" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error approving user" });
  }
};

// 승인거절 요청 처리 엔드포인트
const reject = async (req: Request, res: Response) => {
  const currentUsername = req.params.userId;

  try {
    const user: User = res.locals.user;
    const currentUser = await User.findOneByOrFail({
      username: currentUsername,
    });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    if (user) {
      // 거절 당한 사용자로 표시
      currentUser.isRejected = true;

      // 거절 처리: 승인 요청 목록에서 요청을 삭제
      user.approvalRequsts = user.approvalRequsts.filter(
        (requesterId) => requesterId !== currentUsername
      );
    }

    await user.save();

    return res.json({ message: "User request rejected" });
  } catch (error) {
    return res.status(500).json({ message: "Error rejecting user request" });
  }
};

// 아이디 찾기
const findUsername = async (req: Request, res: Response) => {
  const { email, tel } = req.body;

  try {
    let errors: any = {};

    //비워져 있다면 에러를 프론트엔드로 보내주기
    if (isEmpty(email)) errors.email = "이메일을 입력해주세요.";
    if (isEmpty(tel)) errors.tel = "전화번호를 입력해주세요.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    // 이메일로 사용자 찾기
    const user = await User.findOneBy({ email });

    if (!user) {
      return res.status(404).json({ email: "사용자를 찾을 수 없습니다." });
    }

    const checkTel = await User.findOneBy({ tel });

    if (!checkTel) {
      return res.status(404).json({ tel: "전화번호가 맞지 않습니다." });
    }
    const username = user.username;

    return res.json({ message: `사용자의 아이디는 ${username} 입니다.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 비밀번호 찾기
const findPassword = async (req: Request, res: Response) => {
  const { email, username, tel } = req.body;

  try {
    let errors: any = {};

    //비워져 있다면 에러를 프론트엔드로 보내주기
    if (isEmpty(email)) errors.email = "이메일을 입력해주세요.";
    if (isEmpty(username)) errors.username = "닉네임을 입력해주세요.";
    if (isEmpty(tel)) errors.tel = "전화번호를 입력해주세요.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    // 이메일로 사용자 찾기
    const user = await User.findOneBy({ email });

    if (!user) {
      return res.status(404).json({ email: "이메일을 찾을 수 없습니다." });
    }

    const nickName = await User.findOneBy({ username });

    if (!nickName) {
      return res.status(404).json({ username: "닉네임을 찾을 수 없습니다." });
    }

    const checkTel = await User.findOneBy({ tel });

    if (!checkTel) {
      return res.status(404).json({ tel: "전화번호가 맞지 않습니다." });
    }

    // 임시 비밀번호 생성
    const temporaryPassword = generateTemporaryPassword();

    // 새로운 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // 사용자의 비밀번호 업데이트
    user.password = hashedPassword;
    await user.save();

    return res.json({
      message: temporaryPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 비밀번호 변경
const passWordChange = async (req: Request, res: Response) => {
  const { email, username, password, newPassword } = req.body;

  try {
    let errors: any = {};

    //비워져 있다면 에러를 프론트엔드로 보내주기
    if (isEmpty(email)) errors.email = "이메일을 입력해주세요.";
    if (isEmpty(username)) errors.username = "닉네임을 입력해주세요.";
    if (isEmpty(password)) errors.password = "비밀번호를 입력해주세요.";
    if (isEmpty(newPassword))
      errors.newPassword = "새로운 비밀번호를 입력해주세요.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    // 이메일로 사용자 찾기
    const user = await User.findOneBy({ email });

    if (!user) {
      return res.status(404).json({ email: "이메일을 찾을 수 없습니다." });
    }

    const nickName = await User.findOneBy({ username });

    if (!nickName) {
      return res.status(404).json({ username: "닉네임을 찾을 수 없습니다." });
    }

    // 현재 비밀번호 일치 여부 확인
    const isCurrentPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res
        .status(401)
        .json({ password: "현재 비밀번호가 일치하지 않습니다." });
    }

    // 새로운 비밀번호 해싱
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 사용자의 비밀번호 업데이트
    user.password = hashedNewPassword;
    await user.save();

    return res.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

const router = Router();
router.get("/me", userMiddleware, authMiddleware, me);
router.post("/upload", uploadImage.single("file"), uploadPostImage);
router.post("/register", register);
router.post("/register/upload", register);
router.post("/login", login);
router.post("/logout", userMiddleware, authMiddleware, logout);
router.post("/findId", findUsername);
router.post("/findPassword", findPassword);
router.post("/passwordChange", passWordChange);

router.put("/:userId/request-approval", userMiddleware, requestApproval);
router.put("/:userId/approve", userMiddleware, approval);
router.put("/:userId/reject", userMiddleware, reject);
export default router;
