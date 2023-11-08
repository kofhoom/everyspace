import { Router, Request, Response } from "express";
import userMiddleware from "../middlewares/user"; // user 미들웨어
import authMiddleware from "../middlewares/auth"; // auth 미들웨어
import Payment from "../entities/Payment";
import Post from "../entities/Post";

// 구매목록 불러오기
const getPaymentList = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.find();

    return res.json(payment);
  } catch (error) {
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

// 구매목록 저장
const paymentListCreate = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const {
    buyer_music_title,
    buyer_name,
    seller_name,
    paid_amount,
    buyer_email,
    buyer_tel,
    pg_provider,
    success,
  } = req.body;

  try {
    // 해당 identifier 및 slug로 포스트를 찾습니다.
    const post = await Post.findOneByOrFail({ identifier, slug });

    // 업데이트할 내용을 설정합니다.
    const payment = new Payment();
    payment.buyer_music_title = buyer_music_title;
    payment.buyer_name = buyer_name;
    payment.seller_name = seller_name;
    payment.paid_amount = paid_amount;
    payment.buyer_email = buyer_email;
    payment.buyer_tel = buyer_tel;
    payment.pg_provider = pg_provider;
    payment.success = success;

    post.buyername = buyer_name;

    await post.save();
    await payment.save();

    return res.json({ payment, post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const router = Router();

router.get("/list", userMiddleware, authMiddleware, getPaymentList);
router.post(
  "/:identifier/:slug/",
  userMiddleware,
  authMiddleware,
  paymentListCreate
);

export default router;
