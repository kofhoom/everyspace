import { FaHotjar } from "react-icons/fa";
import { Post, User } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "@/src/context/auth";
import axios from "axios";
import { useRouter } from "next/router";
import useSwR from "swr";
import AudioLayout from "@/src/components/commons/audio";
import { Tag } from "antd";

interface IPostCardProps {
  post: Post;
  subMutate?: () => void;
  mutate?: () => void;
  keyWord?: any;
  type?: string;
}

export default function PostCardList({
  post: {
    identifier,
    slug,
    title,
    subName,
    createdAt,
    body,
    voteScore,
    userVote,
    commentCount,
    url,
    sub,
    username,
    imageUrl,
    imageUrn,
    musicFileUrl,
    musicType,
    price,
    priceChoose,
    buyername,
  },
  mutate,
  subMutate,
  keyWord,
  type,
}: IPostCardProps) {
  const { authenticated } = useAuthState();
  const router = useRouter();

  const isInSubPage = router.pathname === "/r/[sub]"; // 분기처리
  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");
    if (value === userVote) value = 0;
    try {
      await axios.post("/votes", {
        identifier,
        slug,
        value,
      });
      if (mutate) {
        mutate();
      }
      if (subMutate) {
        subMutate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data: users, error: getUserError } = useSwR(`/users/`);

  return (
    <div
      className="flex mb-4 bg-white border rounded-lg shadow-md flex-col-reverse hover:shadow-xl transition-shadow"
      id={identifier}
    >
      {/* 포스트 데이터 부분 */}
      <div
        className={`w-full p-4 ${
          type === "mystore" ? "flex justify-between ms:flex-col" : ""
        }`}
      >
        {type !== "mystore" && (
          <div className="w-full flex items-center mb-4 pb-3">
            <div className="w-full flex items-center border-b border-b-#e5e7eb pb-3  justify-between">
              <div className="flex items-center">
                <Link href={`/r/${subName}`} legacyBehavior>
                  <a className="flex justify-center items-center w-10 h-10 border border-gray-300 rounded-full overflow-hidden mr-1">
                    {users?.map(
                      (el: User) =>
                        el.username === username && (
                          <Image
                            key={el.username}
                            src={el.userImageUrl}
                            alt="sub"
                            className="rounded-full cursor-pointer border-gray-200 w-full"
                            width={34}
                            height={34}
                          />
                        )
                    )}
                  </a>
                </Link>
                <p className="text-xs text-black-400">
                  <Link href={`/mystore/${username}`} legacyBehavior>
                    <a className="mx-1 font-bold hover:underline">{username}</a>
                  </Link>
                </p>
              </div>
              {/* 분기처리 */}
              <div className="flex items-center">
                {!isInSubPage && subName !== null && (
                  <>
                    <Link href={`/r/${subName}`} legacyBehavior>
                      <a className="w-10 h-10">
                        <Image
                          src={sub?.imageUrl ?? ""}
                          alt="sub"
                          className="rounded-full cursor-pointer w-full"
                          width={34}
                          height={34}
                        />
                      </a>
                    </Link>
                    <Link href={`/r/${subName}`} legacyBehavior>
                      <a className="ml-1 mr-1 text-xs font-bold cursor-pointer hover:underline">
                        from {subName}
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <div
          className={` ${
            type === "mystore"
              ? "store-img-w store-img-wrap ms:max-w-full"
              : "w-full"
          }`}
        >
          {imageUrl ? (
            <div
              className={`max-w-6xl w-full m-auto rounded-md ${
                type === "mystore" ? "mystore-img" : "h-72"
              }`}
              style={{
                backgroundImage: `url(${
                  imageUrn === "undefined" ? "/mainLogo.png" : imageUrl
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid #e5e7eb",
              }}
            ></div>
          ) : (
            <div className="h-72"></div>
          )}
        </div>
        <div
          className={`${
            type === "mystore"
              ? "store-content-w sm:max-w-full ms:w-full"
              : "w-full"
          }`}
        >
          <Link href={url} legacyBehavior>
            <a className="w-full inline-block text-xl font-medium my-4 mb-5 pb-3 border-b border-b-#e5e7eb">
              {keyWord
                ? title
                    .replaceAll(keyWord, `@#$${keyWord}@#$`)
                    .split("@#$")
                    .map((el) => (
                      <span
                        key={identifier}
                        className={el === keyWord ? "font-extrabold" : ""}
                        style={{ color: el === keyWord ? "red" : "black" }}
                      >
                        {el}
                      </span>
                    ))
                : title}
              {type == "catagory" && (
                <p
                  className="text-sm font-normal"
                  style={{ color: "#00000073" }}
                >
                  {body}
                </p>
              )}
            </a>
          </Link>
          <div className="text-xm">
            <div className="flex items-center font-13">
              장르:{" "}
              <Tag
                color="black"
                className="ml-2"
                style={{ fontSize: "inherit" }}
              >
                {keyWord
                  ? musicType
                      .replaceAll(keyWord, `@#$${keyWord}@#$`)
                      .split("@#$")
                      .map((el) => (
                        <span
                          key={identifier}
                          className={el === keyWord ? "font-extrabold" : ""}
                          style={{ color: el === keyWord ? "red" : "white" }}
                        >
                          {el}
                        </span>
                      ))
                  : musicType}
              </Tag>
            </div>
          </div>

          <div className="mb-4 text-xm font-13">
            <p>
              가격:{" "}
              <span className="inline-block mt-1 ml-2">
                {buyername
                  ? "거래완료"
                  : priceChoose === "free"
                  ? "무료"
                  : [price].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                    "원"}
              </span>{" "}
            </p>
          </div>
          {type !== "catagory" && (
            <>
              {musicFileUrl && <AudioLayout audioUrl={musicFileUrl} />}
              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center">
                  <Link href={url} legacyBehavior>
                    <i className="mr-1 fas fa fa-comment-alt fa-xs"></i>
                  </Link>

                  <span className="text-xs">댓글 {commentCount} 개</span>
                </div>
                <div className="flex flex-shrink-0 text-center justify-between">
                  {/* <span className="mx-1 text-xs">{timeForToday(createdAt)}</span> */}
                  <div className="flex">
                    {/* 좋아요 */}

                    <div
                      className="w-6 mx-auto text-gray-400  cursor-pointer  hover:text-red-500"
                      onClick={() => vote(1)}
                    >
                      {userVote === 1 ? (
                        <FaHotjar className="mx-auto text-red-500" />
                      ) : (
                        <FaHotjar className="mx-auto" />
                      )}
                    </div>
                    <p className="text-xs font-bold ml-0.5">{voteScore}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
