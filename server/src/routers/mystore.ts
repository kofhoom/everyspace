import { Router, Request, Response, NextFunction } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
import { mapError, uploadImage } from "../utils/helpers";
import { unlinkSync } from "fs";
import path from "path";
import { User } from "../entities/User";

// 커뮤니티 소유 여부
const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;
  try {
    const reqUser = await User.findOneOrFail({
      where: { username: req.params.username },
    });
    if (reqUser.username !== user.username) {
      return res
        .status(403)
        .json({ error: "이커뮤니티를 소유하고있지 않습니다." });
    }
    res.locals.user = reqUser;
    return next();
  } catch (error: any) {
    return res.status(404).json({ error: "서브를 찾을수 없음니다" });
  }
};

// 이미지 저장
const uploadSubImage = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  try {
    const type = req.body.type;
    // 파일 유형을 지정치 않았을 시에는 업로드 된 파일 삭제
    if (type !== "image" && type !== "banner") {
      if (!req.file?.path) {
        return res.status(400).json({ error: "유효하지 않는 파일" });
      }

      // 파일을 지워주기
      unlinkSync(req.file.path);
      return res.status(400).json({ error: "잘못된 유형" });
    }

    let oldImageUrn: string = "";

    if (type === "image") {
      // 사용중인 urn을 저장합니다. (이전 파일을 아래서 삭제하기 위해서)
      oldImageUrn = user.userImageUrn || "";
      // 새로운 파일 이름을 Urn 으로 넣어줍니다.
      user.userImageUrn = req.file?.filename || "";
    } else if (type === "banner") {
      oldImageUrn = user.userBannerUrn || "";
      user.userBannerUrn = req.file?.filename || "";
    }
    await user.save();

    // 사용하지 않는 이미지 파일 삭제
    if (oldImageUrn !== "") {
      const fullFilename = path.resolve(
        process.cwd(),
        "public",
        "images",
        oldImageUrn
      );
      unlinkSync(fullFilename);
    }
    console.log(user, "asd");

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

router.post(
  "/:username/upload",
  userMiddleware,
  authMiddleware,
  ownSub,
  uploadImage.single("file"),
  uploadSubImage
);

export default router;
