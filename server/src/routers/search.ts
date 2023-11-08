import { Router, Request, Response } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import Payment from "../entities/Payment";

const getSerchDatas = async (req: Request, res: Response) => {
  const { selectedNav, searchData, searchType } = req.params;

  // 회원관리
  if (selectedNav === "members") {
    try {
      const queryBuilder = await AppDataSource.getRepository(
        User
      ).createQueryBuilder("entity");

      if (searchType == "all") {
        queryBuilder.where(
          `entity.username LIKE :searchData OR entity.email LIKE :searchData`,
          {
            searchData: `%${searchData}%`,
          }
        );
      } else {
        queryBuilder.where(`entity.${searchType} LIKE :searchData`, {
          searchData: `%${searchData}%`,
        });
      }

      const result = await queryBuilder.getMany();

      if (!result) {
        return res.status(404).json({ error: "검색결과를 찾을 수 없습니다." });
      }

      return res.send(result);
    } catch (error) {
      return res.status(500).json({ error: "문제가 발생했습니다." });
    }
  }

  // 아지트 관리
  if (selectedNav === "hideout") {
    try {
      const queryBuilder = await AppDataSource.getRepository(
        Sub
      ).createQueryBuilder("entity");

      if (searchType == "all") {
        queryBuilder.where(
          `entity.username LIKE :searchData OR entity.title LIKE :searchData OR entity.description LIKE :searchData`,
          {
            searchData: `%${searchData}%`,
          }
        );
      } else {
        queryBuilder.where(`entity.${searchType} LIKE :searchData`, {
          searchData: `%${searchData}%`,
        });
      }

      const result = await queryBuilder.getMany();

      if (!result) {
        return res.status(404).json({ error: "검색결과를 찾을 수 없습니다." });
      }

      return res.send(result);
    } catch (error) {
      return res.status(500).json({ error: "문제가 발생했습니다." });
    }
  }

  // 작성글 관리
  if (selectedNav === "posts") {
    try {
      const queryBuilder = await AppDataSource.getRepository(
        Post
      ).createQueryBuilder("entity");

      if (searchType == "all") {
        queryBuilder.where(
          `entity.username LIKE :searchData AND entity.title LIKE :searchData AND entity.body LIKE :searchData AND entity.musicType LIKE :searchData AND entity.priceChoose LIKE :searchData AND entity.price LIKE :searchData`,
          {
            searchData: `%${searchData}%`,
          }
        );
      } else {
        console.log(searchData, "asdasd");
        queryBuilder.where(`entity.${searchType} LIKE :searchData`, {
          searchData: `%${searchData}%`,
        });
      }

      const result = await queryBuilder.getMany();

      if (!result) {
        return res.status(404).json({ error: "검색결과를 찾을 수 없습니다." });
      }

      return res.send(result);
    } catch (error) {
      return res.status(500).json({ error: "문제가 발생했습니다." });
    }
  }

  // 작성글 관리
  if (selectedNav === "paymemts") {
    try {
      const queryBuilder = await AppDataSource.getRepository(
        Payment
      ).createQueryBuilder("entity");

      if (searchType == "all") {
        queryBuilder.where(
          `entity.username LIKE :searchData AND entity.title LIKE :searchData AND entity.body LIKE :searchData AND entity.musicType LIKE :searchData AND entity.priceChoose LIKE :searchData AND entity.price LIKE :searchData`,
          {
            searchData: `%${searchData}%`,
          }
        );
      } else {
        queryBuilder.where(`entity.${searchType} LIKE :searchData`, {
          searchData: `%${searchData}%`,
        });
      }

      const result = await queryBuilder.getMany();

      if (!result) {
        return res.status(404).json({ error: "검색결과를 찾을 수 없습니다." });
      }

      return res.send(result);
    } catch (error) {
      return res.status(500).json({ error: "문제가 발생했습니다." });
    }
  }
};

// 포스트 검색 결과 불러오기
const getSearchPost = async (req: Request, res: Response) => {
  const searchData = req.params.serachData;

  try {
    const post = await AppDataSource.getRepository(Post)
      .createQueryBuilder("entity")
      .where("entity.title LIKE :searchData OR entity.body LIKE :searchData", {
        searchData: `%${searchData}%`,
      })
      .getMany();

    if (!post) {
      return res.status(404).json({ error: "검색결과를 찾을 수 없습니다." });
    }

    return res.send(post);
  } catch (error) {
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const router = Router();
router.get("/:serachData", getSearchPost);
router.post(
  "/:selectedNav/:searchType/:searchData",
  userMiddleware,
  authMiddleware,
  getSerchDatas
);

export default router;
