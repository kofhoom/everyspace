import { Router, Request, Response } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import Comment from "../entities/Comment";
import { uploadImage, uploadMusic } from "../utils/helpers";
import { unlinkSync } from "fs";
import { AppDataSource } from "../data-source";
import Vote from "../entities/Vote";

// 파일 업로드
const uploadPostFile = async (req: Request, res: Response) => {
  try {
    const type = req.body.type;
    // 파일 유형을 지정치 않았을 시에는 업로드 된 파일 삭제
    if (type !== "cover") {
      if (!req.file?.path) {
        return res.status(400).json({ coverImage: "사진을 등록해 주세요" });
      }

      // 파일을 지워주기
      unlinkSync(req.file.path);
      return res.status(400).json({ error: "잘못된 유형2" });
    }

    return res.json(req.file?.filename);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// 파일 업로드
const uploadPostFile2 = async (req: Request, res: Response) => {
  try {
    const type = req.body.type;
    // 파일 유형을 지정치 않았을 시에는 업로드 된 파일 삭제
    if (type !== "music") {
      if (!req.file?.path) {
        return res.status(400).json({ music: "음원을 등록해 주세요" });
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

// 포스트생성
const createPost = async (req: Request, res: Response) => {
  const {
    title,
    body,
    sub,
    priceChoose,
    price,
    musicType,
    imageUrn,
    musicFileUrn,
  } = req.body;

  if (title.trim() === "") {
    return res.status(400).json({ title: "제목은 비워둘 수 없습니다." });
  }

  if (priceChoose !== "free" && !price) {
    return res.status(400).json({ price: "가격을 설정해 주세요" });
  }

  if (!musicType) {
    return res.status(400).json({ musicType: "장르를 설정해 주세요" });
  }
  if (!body.trim()) {
    return res.status(400).json({ body: "내용을 입력해 주세요" });
  }

  const user = res.locals.user;

  try {
    const subRecord = await Sub.findOneByOrFail({ name: sub });
    const post = new Post();
    post.title = title;
    post.body = body;
    post.user = user;
    post.priceChoose = priceChoose;
    post.price = price;
    post.musicType = musicType;
    post.sub = subRecord;
    post.imageUrn = imageUrn;
    post.musicFileUrn = musicFileUrn;

    await post.save();
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

// 포스트 삭제
const deletePost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneByOrFail({ identifier, slug });
    const comments = await Comment.find({
      where: { postId: post.id },
    });

    if (!post) {
      return res.status(404).json({ error: "포스트를 찾을 수 없습니다." });
    }

    await Vote.delete({ postId: post.id });
    await Vote.delete({ commentId: post.id });
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Post)
      .where("id = :id", { id: post.id })
      .execute();

    console.log(post, comments);
    return res.json({ message: "포스트가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

// 포스트 정보 불러오기
const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneOrFail({
      where: { identifier, slug },
      relations: ["sub", "votes"],
    });
    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }
    return res.send(post);
  } catch (error) {
    return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
  }
};

const getPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 2) as number;

  try {
    const posts = await Post.find({
      order: { createdAt: "DESC" },
      relations: ["sub", "votes", "comments"],
      skip: currentPage * perPage,
      take: perPage,
    });

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생하였습니다." });
  }
};

// 인기순
const getPopularityPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: { createdAt: "DESC" },
      relations: ["sub", "votes", "comments"],
      take: 3,
    });

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    // voteScore 값을 기준으로 내림차순으로 정렬
    posts.sort((a, b) => b.voteScore - a.voteScore);

    // voteScore가 0이 아닌 게시물만 필터링
    const popularPosts = posts.filter((post) => post.voteScore !== 0);

    return res.json(popularPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생하였습니다." });
  }
};

// 댓글 작성
const creatPostComment = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body; // comment.body
  try {
    const post = await Post.findOneByOrFail({ identifier, slug });
    const comment = new Comment();
    comment.body = body;
    comment.user = res.locals.user;
    comment.post = post;

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }
    await comment.save();
    return res.json(comment);
  } catch (error) {
    return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
  }
};

// 댓글 가져오기
const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneByOrFail({ identifier, slug });
    const comments = await Comment.find({
      where: { postId: post.id },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });

    if (res.locals.user) {
      comments.forEach((c) => c.setUserVote(res.locals.user));
    }
    return res.json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

// 댓글 삭제
const deleteComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneByOrFail({ identifier, slug });

    await Comment.delete({ postId: post.id });
    return res.json({ message: "포스트가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const router = Router();

router.post("/", userMiddleware, authMiddleware, createPost);
router.get("/", userMiddleware, getPosts);
router.get("/popularity", userMiddleware, getPopularityPosts);
router.post(
  "/upload",
  userMiddleware,
  authMiddleware,
  uploadImage.single("file"),
  uploadPostFile
);
router.post(
  "/music/upload",
  userMiddleware,
  authMiddleware,
  uploadMusic.single("file"),
  uploadPostFile2
);

router.post(
  "/:identifier/:slug/delete",
  userMiddleware,
  authMiddleware,
  deletePost
);
router.get("/:identifier/:slug", userMiddleware, getPost);

router.post("/:identifier/:slug/comments", userMiddleware, creatPostComment);
router.post(
  "/:identifier/:slug/comments/delete",
  userMiddleware,
  authMiddleware,
  deleteComments
);
router.get("/:identifier/:slug/comments", userMiddleware, getPostComments);
export default router;
