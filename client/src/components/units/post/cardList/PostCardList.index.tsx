import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Post } from "@/types";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useAuthState } from "@/src/context/auth";
import axios from "axios";
import { useRouter } from "next/router";
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
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    sub,
    username,
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
  return (
    <div className="flex mb-4 bg-white rounded" id={identifier}>
      {/* 좋아요 싫어요 기능 부분 */}
      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
        {/* 좋아요 */}
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          {userVote === 1 ? (
            <FaArrowUp className="mx-auto text-red-500" />
          ) : (
            <FaArrowUp />
          )}
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* 싫어요 */}
        <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          {userVote === -1 ? (
            <FaArrowDown className="mx-auto text-blue-500" />
          ) : (
            <FaArrowDown />
          )}
        </div>
      </div>
      {/* 포스트 데이터 부분 */}
      <div className="w-full p-2">
        <div className="flex items-center justify-between mb-2">
          {/* 분기처리 */}
          {!isInSubPage && (
            <div className="flex items-center">
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
                <a className="ml-2 text-xs font-bold cursor-pointer hover:underline">
                  from {subName}
                </a>
              </Link>
              <span className="mx-l text-xs text-gray-400">·</span>
            </div>
          )}
          <p className="text-xs text-gray-400">
            posted by
            <Link href={`/u/${username}`} legacyBehavior>
              <a className="mx-1 font-bold hover:underline">{username}</a>
            </Link>
            <Link href={url} legacyBehavior>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url} legacyBehavior>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex items-center mt-2">
          <Link href={url} legacyBehavior>
            <i className="mr-1 fas fa fa-comment-alt fa-xs"></i>
          </Link>
          <span>댓글 {commentCount} 개</span>
        </div>
      </div>
    </div>
  );
}
