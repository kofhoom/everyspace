import { FaHotjar } from "react-icons/fa";
import { Post, User } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "@/src/context/auth";
import axios from "axios";
import { useRouter } from "next/router";
import useSwR from "swr";
import { timeForToday } from "@/utils/helpers";
import AudioLayout from "@/src/components/commons/audio";
import { Tag } from "antd";
interface IPostCardProps {
  post: Post;
  subMutate?: () => void;
  mutate?: () => void;
}
export default function PostCardList({
  post: {
    identifier,
    slug,
    title,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    sub,
    username,
    imageUrl,
    musicFileUrl,
    musicType,
    price,
    priceChoose,
  },
  mutate,
  subMutate,
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

  console.log(sub);
  return (
    <div
      className="flex mb-4 bg-white rounded-lg shadow-md flex-col-reverse hover:shadow-xl transition-shadow"
      id={identifier}
    >
      <div className="flex flex-shrink-0 p-2 text-center justify-between">
        <Link href={url} legacyBehavior>
          <a className="mx-1 text-xs">{timeForToday(createdAt)}</a>
        </Link>
        <div className="flex">
          {/* 좋아요 */}
          <p className="text-xs font-bold mr-1">{voteScore}</p>
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
        </div>
      </div>
      {/* 포스트 데이터 부분 */}
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-b-#e5e7eb">
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
                        className="rounded-full cursor-pointer border-gray-200"
                        width={34}
                        height={34}
                      />
                    )
                )}
              </a>
            </Link>
            <p className="text-xs text-black-400">
              <Link href={`/u/${username}`} legacyBehavior>
                <a className="mx-1 font-bold hover:underline">{username}</a>
              </Link>
            </p>
          </div>
          {/* 분기처리 */}
          <div className="flex items-center">
            {!isInSubPage && subName !== "nomal" && (
              <>
                <Link href={`/r/${subName}`} legacyBehavior>
                  <a>
                    <Image
                      src={sub!.imageUrl}
                      alt="sub"
                      className="rounded-full cursor-pointer"
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

        {imageUrl ? (
          <div
            className="w-72 h-72 m-auto rounded-md"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid #e5e7eb",
            }}
          ></div>
        ) : (
          <div className="h-80"></div>
        )}
        <Link href={url} legacyBehavior>
          <a className="w-full inline-block text-xl font-medium my-4 mb-5 pb-3 border-b border-b-#e5e7eb">
            {title}
          </a>
        </Link>
        <div className="text-xm">
          <div className="flex items-center font-13">
            장르:{" "}
            <Tag color="black" className="ml-2" style={{ fontSize: "inherit" }}>
              {musicType}
            </Tag>
          </div>
        </div>

        <div className="mb-4 text-xm font-13">
          <p>
            가격:{" "}
            <span className="inline-block mt-1 ml-2">
              {priceChoose === "free"
                ? "무료"
                : "₩" +
                  [price].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>{" "}
          </p>
        </div>
        {musicFileUrl && <AudioLayout audioUrl={musicFileUrl} />}
        <div className="flex items-center mt-2">
          <Link href={url} legacyBehavior>
            <i className="mr-1 fas fa fa-comment-alt fa-xs"></i>
          </Link>
          <span className="text-xs">댓글 {commentCount} 개</span>
        </div>
      </div>
    </div>
  );
}
