import { Comment, Post, User } from "@/types";
import { useRouter } from "next/router";
import useSwR from "swr";
import PostCardList from "../post/cardList/PostCardList.index";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useAuthState } from "@/src/context/auth";
import { Tabs, Button } from "antd";
import type { TabsProps } from "antd";
import BasicTable from "../../commons/table";
import axios from "axios";
import { type MouseEventHandler } from "react";
import { TfiWrite } from "react-icons/tfi";
import { AiOutlineComment, AiOutlineOrderedList } from "react-icons/ai";
export default function UserList() {
  const { user } = useAuthState();
  const router = useRouter();
  const username = router.query.username;
  const { data, error, mutate } = useSwR(
    username ? `/users/${username}` : null
  );
  if (!data) return null;

  const handleApprove: MouseEventHandler<HTMLElement> = async (event) => {
    const userId = event.currentTarget.getAttribute("data-username"); // 이벤트 데이터 속성에서 username 가져오기

    if (userId) {
      // 승인 처리 API 호출
      try {
        const result = await axios.put(`/auth/${userId}/approve`);
        // API 호출 성공 시 사용자 목록 업데이트
        mutate();
        console.log(result);
      } catch (error) {
        console.error("Error approving user", error);
      }
    }
  };

  const columns = [
    {
      title: "유저 이름",

      fixed: "center",
    },
    {
      title: "맴버 승인",
      dataIndex: "",
      key: "x",

      render: (el: any) => (
        <div className="w-full flex">
          <Button
            type="primary"
            className="hover:outline-black font-medium w-1/2 mr-2"
            block
            size={"small"}
            onClick={(e) => handleApprove(e)}
            data-username={el}
          >
            수락
          </Button>
          <Button
            // type="primary"
            className="hover:outline-black font-medium w-1/2 danger"
            block
            size={"small"}
            danger
          >
            거절
          </Button>
        </div>
      ),
    },
  ];
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "내가 쓴 글",
      children: (
        <div className="w-full">
          <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
            <TfiWrite className="mr-2" /> 내가 쓴 글
          </p>
          {data.userData.map((data: any) => {
            if (data.type === "Post") {
              const post: Post = data;
              return (
                <>
                  <PostCardList key={post.identifier} post={post} />
                </>
              );
            }
          })}
        </div>
      ),
    },
    {
      key: "2",
      label: "내가 쓴 댓글",
      children: (
        <div className="w-full">
          <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
            <AiOutlineComment className="mr-2" /> 내가 쓴 댓글
          </p>
          {data.userData.map((data: any) => {
            const comment: Comment = data;
            return (
              <>
                <div
                  key={comment.identifier}
                  className="flex my-4 bg-white rounded"
                >
                  <div className="flex-shrink-0 w-10 py-10 text-center bg-white border-r rounded-l">
                    <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
                  </div>
                  <div className="w-full p-2">
                    <p className="mb-2 text-xs text-gray-500">
                      <Link href={`/u/${comment.username}`} legacyBehavior>
                        <a className="cusor-pointer hover:underline mr-1">
                          {comment.username}
                        </a>
                      </Link>
                      <span>command on</span>
                      <Link href={`/u/${comment.post?.url}`} legacyBehavior>
                        <a className="cusor-pointer font-semibold hover:underline mr-1">
                          {comment.post?.title}
                        </a>
                      </Link>
                      <span>·</span>
                      <Link href={`/u/${comment.post?.subName}`} legacyBehavior>
                        <a className="cusor-pointer font-semibold hover:underline">
                          /r/{comment.post?.subName}
                        </a>
                      </Link>
                    </p>
                    <hr />
                    <p className="p-1">{comment.body}</p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ),
    },
    {
      key: "3",
      label: "맴버가입 신청 리스트",

      children: (
        <div className="w-full">
          <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
            <AiOutlineOrderedList className="mr-2" /> 맴버가입 신청 리스트
          </p>
          <BasicTable columns={columns} data={user?.approvalRequsts} />
        </div>
      ),
    },
  ];
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="w-full md:mr-3 md:w-8/12"
        tabPosition={"left"}
        type="card"
      />
      {/* 유저 포스트 댓글 리스트 */}

      {/* 유저 정보 */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="flex items-center p-3 bg-gray-400 rounded-t">
          <a className="flex justify-center items-center w-8 h-8 border border-gray-300 rounded-full overflow-hidden mr-2">
            <Image
              src={data.user.userImageUrl}
              alt="sub"
              className="rounded-full cursor-pointer border-gray-200"
              width={34}
              height={34}
            />
          </a>

          <p className="pl-2 text-md font-semibold">{data.user.username}</p>
        </div>
        <div className="p-2 bg-white rounded-b">
          <p>{dayjs(data.user.createdAt).format("YYYY.MM.DD")} 가입</p>
        </div>
      </div>
    </div>
  );
}
