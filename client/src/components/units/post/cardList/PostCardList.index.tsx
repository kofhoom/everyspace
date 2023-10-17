import { FaArrowUp, FaArrowDown, FaHotjar } from "react-icons/fa";
import { Post, User } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "@/src/context/auth";
import axios from "axios";
import { useRouter } from "next/router";
import useSwR from "swr";
import { timeForToday } from "@/utils/helpers";
import AudioLayout from "@/src/components/commons/audio";
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
    imageUrl,
    musicFileUrl,
  },
  mutate,
  subMutate,
}: IPostCardProps) {
  const { authenticated } = useAuthState();

  const router = useRouter();

  const authRoutes = ["/"];
  const authRoute = authRoutes.includes(router.pathname);
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
      className="flex mb-4 bg-white rounded-md shadow-md flex-col-reverse"
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
        {/* 싫어요 */}
        {/* <div
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          {userVote === -1 ? (
            <FaArrowDown className="mx-auto text-blue-500" />
          ) : (
            <FaArrowDown />
          )}
        </div> */}
      </div>
      {/* 좋아요 싫어요 기능 부분 */}

      {/* 포스트 데이터 부분 */}
      <div className="w-full p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Link href={`/r/${subName}`} legacyBehavior>
              <a className="flex justify-center items-center w-10 h-10 border border-gray-300 rounded-full overflow-hidden mr-1">
                {users?.map((el: User) =>
                  el.username === username ? (
                    <Image
                      key={el.username}
                      src={el.userImageUrl}
                      alt="sub"
                      className="rounded-full cursor-pointer border-gray-200"
                      width={34}
                      height={34}
                    />
                  ) : (
                    ""
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
            {!isInSubPage && (
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
                {/* <span className="mx-l text-xs text-gray-400">·</span> */}
              </>
            )}
          </div>
        </div>

        {imageUrl && (
          <div
            className="h-56"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        )}
        <Link href={url} legacyBehavior>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
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
