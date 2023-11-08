// 초기 셋팅
import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";

import authRoutes from "./routers/auth";
import boardRoutes from "./routers/boards";
import postsRoutes from "./routers/posts";
import votesRoutes from "./routers/votes";
import userRoutes from "./routers/users";
import paymentRoutes from "./routers/payments";
import myStoreRoutes from "./routers/mystore";
import searchRoutes from "./routers/search";

import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
const origin = "http://localhost:3000";

app.use(
  cors({
    origin,
    credentials: true, // 쿠키에 유져 토큰 저장 허용
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
dotenv.config(); //환경변수 설정

app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/votes", votesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/mystore", myStoreRoutes);
app.use("/api/search", searchRoutes);

app.use(express.static("public")); // 브라우저로 접근 할때 정적파일 제공 허용
let port = 4000;

app.listen(port, async () => {
  console.log(`${port}연결성공`);

  AppDataSource.initialize()
    .then(() => {
      console.log("database initialized");
    })
    .catch((error) => console.log(error));
});
