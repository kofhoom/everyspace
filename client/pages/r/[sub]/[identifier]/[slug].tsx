declare const window: typeof globalThis & {
  IMP: any;
};

import { useAuthState } from "@/src/context/auth";
import { Post } from "@/types";
import { Comment } from "@/types";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState, useRef } from "react";
import useSwR, { mutate } from "swr";
import AudioLayout from "@/src/components/commons/audio";
import { FaHotjar } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { Button, Space, Dropdown, type MenuProps, Divider, Tag } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
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
      if (sub === null) router.push(`/r/${sub}`);
      else router.push(`/`);
    } catch (error) {
      console.log(error);
    }
  };

  // 포스트 수정
  const handlePostEdit = async () => {
    router.push(`/r/${sub}/${post?.identifier}/${post?.slug}/update`);
  };

  // 포스트 리스트 가져오기
  const {
    data: post,
    error,
    mutate: postMutate,
  } = useSwR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);

  const isOwnUser = user?.username === post?.username; // 자신 글 & 댓글 여부
  const isBuying = user?.username === post?.buyername; // 구매여부

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

    if (e.key === "수정") {
      handlePostEdit();
    }
  };

  const downloadHandler = () => {
    if (!authenticated) {
      router.push("/login");
      return;
    }
    downloadAtag.current?.click();
  };
  const onClickPayment = async () => {
    if (!authenticated) return router.push("/login");
    if (isOwnUser) return window.alert("자신의 곡은 구매하실 수 없습니다.");

    const IMP = window.IMP;
    IMP.init("imp35254072");
    IMP.request_pay(
      {
        // param
        pg: "kakaopay",
        pay_method: "card",
        //  merchant_uid: "ORD20180131-0000011",
        name: post?.title,
        amount: post?.price,
        buyer_email: user?.email,
        buyer_name: user?.username,
        buyer_tel: "01042424242",
        buyer_addr: "서울특별시 강남구 신사동",
        buyer_postcode: "01181",
        // m_redirect_url: "http://localhost:3000/section28/28-01-payment",
        // 모바일에서는 결제시, 페이지 주소가 바뀜. 따라서 결제 끝나고 들어갈 주소가 필요
      },
      async (rsp: any) => {
        // callback
        if (rsp.success === true) {
          // 결제 성공 시 로직,
          console.log(rsp);
          try {
            // 이미지 업로드 API 호출
            const { data } = await axios.post(
              `/payments/${post?.identifier}/${post?.slug}`,
              {
                buyer_music_title: rsp.name,
                buyer_name: rsp.buyer_name,
                seller_name: post?.username,
                paid_amount: rsp.paid_amount,
                buyer_email: rsp.buyer_email,
                buyer_tel: rsp.buyer_tel,
                pg_provider: rsp.pg_provider,
                success: rsp.success,
              }
            );

            console.log(data);
            postMutate();
          } catch (error) {
            console.log(error);
          }
          // 백엔드에 결제관련 데이터 넘겨주기 => 즉, 뮤테이션 실행하기
        } else {
          // 결제 실패 시 로직,
        }
      }
    );
  };
  return (
    <div className="flex max-w-7xl px-4 pt-5 justify-center m-auto">
      <script src="https://cdn.iamport.kr/v1/iamport.js" defer></script>
      <div className="w-full md:w-8/12">
        <div className="bg-white border rounded-md shadow-md overflow-hidden pb-6">
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
                        <Link href={`/mystore/${post.username}`} legacyBehavior>
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
                    {!isOwnUser && (
                      <>
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
                            onClick={onClickPayment}
                            disabled={isBuying ? true : false}
                          >
                            {isBuying ? "구매완료" : "구매"}
                          </Button>
                        )}
                      </>
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
                        좋아요 {post.voteScore}
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
                        링크 공유
                      </Button>
                      {isOwnUser && (
                        <Dropdown.Button
                          type="primary"
                          size={size}
                          menu={{ items, onClick: onMenuClick }}
                        >
                          더 보기
                        </Dropdown.Button>
                      )}
                    </Space>
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
                <div className="flex flex-col-reverse" key={comment.identifier}>
                  <div className="w-full px-4">
                    <div className="flex items-center mb-1">
                      <p className="flex items-center text-xs leading-none">
                        <Link href={`/u/${comment.username}`} legacyBehavior>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`작성일 ${dayjs(comment.createdAt).format(
                            "YYYY-MM-DD HH:mm"
                          )}`}
                        </span>
                        <div
                          className="ml-2 flex item-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                          onClick={() => vote(1, comment)}
                        >
                          {comment.userVote === 1 ? (
                            <FaHotjar className="mx-auto text-red-500" />
                          ) : (
                            <FaHotjar />
                          )}
                          <p className="ml-1 text-xs font-bold">
                            {comment.voteScore}
                          </p>
                        </div>
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
                    <Divider className="mb-3"></Divider>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="w-full flex flex-col items-end px-6">
            <Divider></Divider>
            <button
              onClick={() => router.replace(`${sub ? "/" : `/r/${sub}`}`)}
            >
              <a className="px-9 py-1 text-white bg-black rounded-lg">목록</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
