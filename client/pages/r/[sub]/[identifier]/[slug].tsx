import { useAuthState } from "@/src/context/auth";
import { Post } from "@/types";
import { Comment } from "@/types";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState, useRef, useEffect } from "react";
import useSwR, { mutate } from "swr";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import AudioLayout from "@/src/components/commons/audio";

export default function PostContentPage() {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { authenticated, user } = useAuthState();
  const [newComment, setNewComment] = useState("");

  // 포스트 삭제
  const handlePostDelete = async () => {
    try {
      await axios.post(`/posts/${post?.identifier}/${post?.slug}/delete`);
      router.push(`/r/${sub}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 포스트 리스트 가져오기
  const {
    data: post,
    error,
    mutate: postMutate,
  } = useSwR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);

  const isOwnUser = user?.username === post?.username; // 자신 글 & 댓글 여부

  // 포스트 댓글 가져오기
  const { data: comments, mutate: commentMutate } = useSwR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  // 댓글작성 핸들러
  const handleCommentSumit = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") {
      return;
    }
    try {
      await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
        body: newComment,
      });
      // useSwR로 캐시 된(저장된) 데이터를 다시 갱신하여 불러오기 위한 함수 get으로 재요청
      commentMutate();
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  // 좋아요 싫어요 핸들러
  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) router.push("/login");

    // 이미 클릭 한 vote 버튼을 눌렀을 시에는 reset
    if (
      (!comment && value === post?.userVote) ||
      (comment && comment.userVote === value)
    ) {
      value = 0;
    }

    try {
      await axios.post("/votes", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });
      postMutate();
      commentMutate();
    } catch (error) {
      console.log(error);
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async () => {
    try {
      await axios.post(
        `/posts/${post?.identifier}/${post?.slug}/comments/delete/`
      );
      router.push(`/r/${sub}/${post?.identifier}/${post?.slug}/`);
      commentMutate();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">
        <div className="bg-white rounded">
          {post && (
            <>
              <div className="flex">
                {/* 좋아요 싫어요 기능 부분 */}
                <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                  {/* 좋아요 */}
                  <div
                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => vote(1)}
                  >
                    {post.userVote === 1 ? (
                      <FaArrowUp className="mx-auto text-red-500" />
                    ) : (
                      <FaArrowUp />
                    )}
                  </div>

                  <p className="text-xs font-bold">{post.voteScore}</p>
                  {/* 싫어요 */}
                  <div
                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                    onClick={() => vote(-1)}
                  >
                    {post.userVote === -1 ? (
                      <FaArrowDown className="mx-auto text-blue-500" />
                    ) : (
                      <FaArrowDown />
                    )}
                  </div>
                </div>
                <div className="py-2 pr-2 w-full">
                  <div className="flex items-center">
                    <p className="text-xs text-gray-400">
                      posted by
                      <Link href={`/u/${post.username}`} legacyBehavior>
                        <a className="mx-1 hover:underline">
                          /u/{post.username}
                        </a>
                      </Link>
                      <Link href={post.url} legacyBehavior>
                        <a className="mx-1 hover:underline">
                          {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                        </a>
                      </Link>
                    </p>
                    {isOwnUser && (
                      <div className="ml-auto">
                        <span
                          className="text-xs text-gray-400 mr-2 hover:underline hover:text-gray-500 cursor-pointer"
                          onClick={handlePostDelete}
                        >
                          삭제
                        </span>
                        <span className="text-xs text-gray-400 mr-2 hover:underline hover:text-gray-500 cursor-pointer">
                          수정
                        </span>
                      </div>
                    )}
                  </div>

                  {post.imageUrl && (
                    <div
                      className="h-56"
                      style={{
                        backgroundImage: `url(${post.imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  )}
                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  <h1 className="my-1 text-xl font-medium">
                    {post.price + "원"}
                  </h1>
                  <h1 className="my-1 text-xl font-medium">
                    {post.priceChoose}
                  </h1>
                  <h1 className="my-1 text-xl font-medium">
                    <AudioLayout audioUrl={post.musicFileUrl} />
                  </h1>
                  <h1 className="my-1 text-xl font-medium">{post.musicType}</h1>
                  <p className="my-3 text-sm">{post.body}</p>
                  <div className="flex">
                    <button>
                      <i className="mr-1 fas fa-comment-alt fa-xs"> </i>
                      <span className="font-bold">
                        {post.commentCount} Comments
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 댓글 작성 구간 */}
              <div className="pr-6 mb-4 pl-9 pb-3">
                {authenticated ? (
                  <div>
                    <p className="mb-1 text-xs">
                      <Link href={`/u/${user?.username}`} legacyBehavior>
                        <a className="font-semibold text-blue-500">
                          {user?.username}
                        </a>
                      </Link>
                      {""}으로 댓글 작성
                    </p>
                    <form onSubmit={handleCommentSumit}>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                      ></textarea>
                      <div className="flex justify-end mt-1">
                        <button
                          className="px-3 py-1 text-white bg-gray-400 rounded"
                          disabled={newComment.trim() === ""}
                        >
                          댓글 작성
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                    <p className="font-semibold text-gray-400">
                      댓글 작성을 위해서 로그인 해주세요
                    </p>
                    <div>
                      <Link href={`/login`} legacyBehavior>
                        <a className="px-3 py-1 text-white bg-gray-400 rounded">
                          로그인
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {/* 댓글 리스트 부분 */}
              {comments?.map((comment) => (
                <div className="flex" key={comment.identifier}>
                  {/* 좋아요 싫어요 기능 부분 */}
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                    {/* 좋아요 */}
                    <div
                      className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1, comment)}
                    >
                      {comment.userVote === 1 ? (
                        <FaArrowUp className="mx-auto text-red-500" />
                      ) : (
                        <FaArrowUp />
                      )}
                    </div>
                    <p className="text-xs font-bold">{comment.voteScore}</p>
                    {/* 싫어요 */}
                    <div
                      className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                      onClick={() => vote(-1, comment)}
                    >
                      {comment.userVote === -1 ? (
                        <FaArrowDown className="mx-auto text-blue-500" />
                      ) : (
                        <FaArrowDown />
                      )}
                    </div>
                  </div>
                  <div className="py-2 pr-2 w-full">
                    <div className="flex items-center mb-1">
                      <p className=" text-xs leading-none">
                        <Link href={`/u/${comment.username}`} legacyBehavior>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`${comment.voteScore} posts ${dayjs(
                            comment.createdAt
                          ).format("YYYY-MM-DD HH:mm")}`}
                        </span>
                      </p>
                      {/* 댓글 삭제 */}
                      {isOwnUser && (
                        <div className="ml-auto">
                          <span
                            className="text-xs text-gray-400 mr-2 hover:underline hover:text-gray-500 cursor-pointer"
                            onClick={handleCommentDelete}
                          >
                            삭제
                          </span>
                        </div>
                      )}
                    </div>
                    <p>{comment.body}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
