import { NextFunction, Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
import { isEmpty } from "class-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import multer, { FileFilterCallback } from "multer";
import { makeId } from "../utils/helpers";
import path from "path";
import { unlinkSync } from "fs";

/* 라우터 설정 */
const createBoard = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }

  try {
    // sub instance 생성 수 데이터베이스에 저장

    const user: User = res.locals.user;
    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;
    sub.subMember = [];
    await sub.save();

    // 저장한 정보 프론트엔드로 전달해주기
    return res.json(sub);
  } catch (error) {
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

// 아지트 삭제
const deleteSub = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const sub = await Sub.findOneByOrFail({ name });

    if (!sub) {
      return res.status(404).json({ error: "아지트를 찾을 수 없습니다." });
    }

    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Sub)
      .where("name = :name", { name: sub.name })
      .execute();

    return res.json({ message: "아지트가 성공적으로 삭제되었습니다." });
  } catch (error: any) {
    console.log(error);
    return res.status(404).json({ error: "서브를 찾을수 없음니다" });
  }
};

const topSubs = async (_: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' ||s."imageUrn",'https://www.gravatar.com/avatar?d=mp&f=y')`;
    const subs = await AppDataSource.createQueryBuilder()
      .select(
        `s.title, s.name, s.username, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p."subName"`)
      .groupBy('s.title, s.name, s.username, "imageUrl"')
      .orderBy(`"postCount"`, "DESC")
      .limit(12)
      .execute();

    return res.json(subs);
  } catch (error) {
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

// 커뮤니티 상세
const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const sub = await Sub.findOneByOrFail({ name });

    // 포스트를 생성한 후에 해당 sub에 속하는 포스트 정보들을 넣어주기
    const posts = await Post.find({
      where: { subName: sub.name },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });
    sub.posts = posts;
    if (res.locals.user) {
      sub.posts.forEach((p) => p.setUserVote(res.locals.user));
    }
    return res.json(sub);
  } catch (error: any) {
    return res.status(404).json({ error: "서브를 찾을수 없음니다" });
  }
};

const getSubs = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 2) as number;
  try {
    const sub = await Sub.find({
      order: { createdAt: "DESC" },
      relations: ["posts"],
      skip: currentPage * perPage,
      take: perPage,
    });

    // 포스트를 생성한 후에 해당 sub에 속하는 포스트 정보들을 넣어주기
    return res.json(sub);
  } catch (error: any) {
    return res.status(404).json({ error: "서브를 찾을수 없음니다" });
  }
};

const getAllSubs = async (req: Request, res: Response) => {
  try {
    const sub = await Sub.find({
      order: { createdAt: "DESC" },
      relations: ["posts"],
    });

    // 포스트를 생성한 후에 해당 sub에 속하는 포스트 정보들을 넣어주기
    return res.json(sub);
  } catch (error: any) {
    return res.status(404).json({ error: "서브를 찾을수 없음니다" });
  }
};

// 커뮤니티 소유 여부
const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });
    if (sub.username !== user.username) {
      return res
        .status(403)
        .json({ error: "이커뮤니티를 소유하고있지 않습니다." });
    }
    res.locals.sub = sub;
    return next();
  } catch (error: any) {
    return res.status(404).json({ error: "서브를 찾을수 없음니다" });
  }
};

// 이미지 저장
const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(10);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      callback(new Error("이미지가 아닙니다."));
    }
  },
});

const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;

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
      oldImageUrn = sub.imageUrn || "";
      // 새로운 파일 이름을 Urn 으로 넣어줍니다.
      sub.imageUrn = req.file?.filename || "";
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = req.file?.filename || "";
    }
    await sub.save();

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
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

router.get("/", getAllSubs);
router.get("/getSubs", getSubs);
router.get("/:name", userMiddleware, getSub);
router.post("/:name/delete", userMiddleware, deleteSub);
router.post("/new", userMiddleware, authMiddleware, createBoard);
router.get("/sub/topSubs", topSubs);
router.post(
  "/:name/upload",
  userMiddleware,
  authMiddleware,
  ownSub,
  upload.single("file"),
  uploadSubImage
);

export default router;
