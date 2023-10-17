import { Router, Request, Response } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import { User } from "../entities/User";
import Post from "../entities/Post";
import Comment from "../entities/Comment";
import { AppDataSource } from "../data-source";
const router = Router();
const getUsersData = async (req: Request, res: Response) => {
  try {
    // 유져정보 가져오기
    const user = await User.find();

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};
const getUserData = async (req: Request, res: Response) => {
  try {
    // 유져정보 가져오기
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      select: ["username", "createdAt"],
    });

    // 유져가 쓴 포스트 정보 가져오기
    const posts = await Post.find({
      where: { username: user.username },
      relations: ["comments", "votes", "sub"],
    });

    // 유져가 쓴 댓글 정보 가져오기
    const comments = await Comment.find({
      where: { username: user.username },
      relations: ["post"],
    });

    if (res.locals.user) {
      const { user } = res.locals;
      posts.forEach((p) => p.setUserVote(user));
      comments.forEach((c) => c.setUserVote(user));
    }
    let userData: any[] = [];

    posts.forEach((p) => userData.push({ type: "Post", ...p.toJSON() }));
    comments.forEach((e) => userData.push({ type: "Comment", ...e.toJSON() }));

    // 최신 정보가 먼저 오게 순서 정렬
    userData.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });

    return res.json({ user, userData });
  } catch (error) {
    return res.status(500).json({ error: "문제가 발생 하였습니다." });
  }
};
router.get("/:username", userMiddleware, getUserData);
router.get("/", getUsersData);

export default router;
