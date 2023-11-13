import { Router, Request, Response } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
import path from "path";

// 구매목록 불러오기
const getDownloadMusic = async (req: Request, res: Response) => {
  const filename = req.params.filename;
  try {
    // 다운로드 헤더 추가
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // 해당 파일은 이미 정적 파일 디렉토리에 있으므로 단순히 파일을 클라이언트에 전송
    return res.sendFile(filename, {
      root: path.join(__dirname, "../..", "public", "music"),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const router = Router();

router.get(
  "/music/:filename",
  userMiddleware,
  authMiddleware,
  getDownloadMusic
);

export default router;
