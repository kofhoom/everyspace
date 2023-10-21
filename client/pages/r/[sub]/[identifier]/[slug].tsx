import { useAuthState } from "@/src/context/auth";
import { Post } from "@/types";
import { Comment } from "@/types";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState, useRef } from "react";
import useSwR, { mutate } from "swr";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import AudioLayout from "@/src/components/commons/audio";
import { FaHotjar } from "react-icons/fa";
import { Button, Space, Dropdown, type MenuProps, Divider, Tag } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { FaRegCopy } from "react-icons/fa";
import { handleCopyClipBoard } from "@/utils/helpers";

export default function PostContentPage() {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { authenticated, user } = useAuthState();
  const [newComment, setNewComment] = useState("");
  const downloadAtag = useRef<HTMLAnchorElement>(null);
  const [size, setSize] = useState<SizeType>("small"); // default is 'middle'
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

  const items = [
    {
      key: "수정",
      label: "수정",
    },
    {
      key: "삭제",
      label: "삭제",
    },
  ];

  const onMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "삭제") {
      handlePostDelete();
    }
  };

  const downloadHandler = () => {
    if (!authenticated) {
      router.push("/login");
      return;
    }
    downloadAtag.current?.click();
  };

  return (
    <div className="flex max-w-7xl px-4 pt-5 justify-center m-auto">
      <div className="w-full md:w-8/12">
        <div className="bg-white rounded-md shadow-md overflow-hidden">
          {post && (
            <>
              {post.musicFileUrl && (
                <a
                  href={post.musicFileUrl}
                  ref={downloadAtag}
                  target="_blank"
                ></a>
              )}

              <div className="flex mb-4 bg-white p-5">
                <div className="flex w-full justify-between">
                  <div className="md:w-5/12">
                    <div className="mb-4">
                      <h1 className="my-1 text-3xl font-semibold">
                        {post.title}
                      </h1>
                      <p className="text-xs text-gray-400">
                        by
                        <Link href={`/u/${post.username}`} legacyBehavior>
                          <a className="mx-1 hover:underline">
                            {post.username}
                          </a>
                        </Link>
                      </p>
                    </div>
                    <Divider orientation="left" plain></Divider>
                    <div className="mb-2 text-xm">
                      <p>
                        가격:{" "}
                        <span>
                          {post.priceChoose === "free"
                            ? "무료"
                            : [post.price]
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₩"}
                        </span>
                      </p>
                    </div>
                    <div className="mb-4 text-xm">
                      <div className="flex items-center">
                        장르:{" "}
                        <Tag color="black" className="ml-1">
                          {post.musicType}
                        </Tag>
                      </div>
                    </div>

                    <p className="my-4 text-sm mb-5">{post.body}</p>
                    {post.priceChoose === "free" ? (
                      <Button
                        type="primary"
                        className="hover:outline-black font-medium"
                        block
                        size={"large"}
                        onClick={downloadHandler}
                      >
                        다운로드
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        className="hover:outline-black font-medium"
                        block
                        size={"large"}
                      >
                        구매
                      </Button>
                    )}
                    <Divider orientation="left" plain></Divider>
                    <div className="text-xs">
                      <span>released </span>
                      {dayjs(post.createdAt).format("MM, YYYY")}
                    </div>
                  </div>
                  <div className="md:w-6/12">
                    {post.imageUrl && (
                      <div
                        className="md:h-72 mb-3"
                        style={{
                          backgroundImage: `url(${post.imageUrl})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          border: "1px solid #e5e7eb",
                        }}
                      ></div>
                    )}
                    <div className="my-1 text-xl font-medium mb-4">
                      <AudioLayout audioUrl={post.musicFileUrl} />
                    </div>
                    <Space wrap className="mb-2">
                      <Button
                        block
                        type="primary"
                        icon={
                          post.userVote === 1 ? (
                            <FaHotjar className="mx-auto text-red-500" />
                          ) : (
                            <FaHotjar className="mx-auto" />
                          )
                        }
                        size={size}
                        onClick={() => vote(1)}
                      >
                        Like {post.voteScore}
                      </Button>
                      <Button
                        block
                        type="primary"
                        icon={<FaRegCopy />}
                        size={size}
                        onClick={handleCopyClipBoard(
                          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${post.url}`
                        )}
                      >
                        Copy Link
                      </Button>
                      {isOwnUser && (
                        <Dropdown.Button
                          type="primary"
                          size={size}
                          menu={{ items, onClick: onMenuClick }}
                        >
                          More
                        </Dropdown.Button>
                      )}
                    </Space>

                    <div className="flex items-center">
                      {/* {isOwnUser && (
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
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              {/* 댓글 작성 구간 */}
              <div className="pr-6 mb-4 pl-6 pb-3">
                <Divider orientation="left" plain></Divider>

                <div className="flex items-center">
                  <i className="mr-1 fas fa-comment-alt fa-xs"> </i>
                  <span className="font-bold mb-2">
                    {post.commentCount} Comments
                  </span>
                </div>
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
                    <form
                      onSubmit={handleCommentSumit}
                      className="flex items-center"
                    >
                      <textarea
                        className="w-full px-1 border h-8 border-gray-200 rounded focus:outline-none focus:border-gray-600"
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                      ></textarea>
                      <div className="flex justify-end ml-3">
                        <button className="px-3 py-1 font-small  bg-white border transition hover:border-black  rounded-md flex-shrink-0">
                          댓글 작성
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                    <p className="text-gray-400 text-sm">
                      댓글 작성을 위해서 로그인 해주세요
                    </p>
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
        <div className="w-full flex justify-end mt-3">
          <button onClick={() => router.replace(`/r/${sub}`)}>
            <a className="px-3 py-1 text-white bg-black rounded">목록</a>
          </button>
        </div>
      </div>
    </div>
  );
}
