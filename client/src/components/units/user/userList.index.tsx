import useSwR from "swr";
import PostCardList from "../post/cardList/PostCardList.index";
import BasicTable from "../../commons/table";
import axios from "axios";
import Link from "next/link";
import { Tabs, Button, Empty } from "antd";
import type { TabsProps } from "antd";
import { Comment, Post } from "@/types";
import { useRouter } from "next/router";
import { TfiWrite } from "react-icons/tfi";
import { AiOutlineComment, AiOutlineOrderedList } from "react-icons/ai";

export default function UserList() {
  const router = useRouter();
  const username = router.query.username;
  const { data, error, mutate } = useSwR(
    username ? `/users/${username}` : null
  );

  if (!data) return null;
  const myPostListArry = data.userData.filter((el: any) => el.type == "Post");
  const myCommentListArry = data.userData.filter(
    (el: any) => el.type == "Comment"
  );

  const userPayListArry = data.userData.filter(
    (el: any) => el.type == "Payment"
  );

  const userSellingPostListArry = data.userData.filter(
    (el: any) => el.type == "myPostSellItems"
  );
  console.log(userSellingPostListArry);
  const handleDownload = (address: string) => async (e: any) => {
    const rep: string | undefined = address.split("/").at(-1);
    try {
      const response = await axios.get(`/download/music/${rep}`, {
        responseType: "blob", // 요청의 응답 형식을 blob으로 설정
      });

      // Blob을 URL로 변환
      const url = window.URL.createObjectURL(response.data);

      // a 태그를 생성하여 다운로드 링크 설정
      const a = document.createElement("a");
      a.href = url;

      // 추출된 파일 이름 설정 (예시: 'example.wav')
      const filename = rep;
      a.download = filename ?? "";

      // a 태그를 body에 추가하고 클릭하여 다운로드
      document.body.appendChild(a);
      a.click();

      // a 태그 제거
      document.body.removeChild(a);

      // Blob URL 해제
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading music", error);
    }
  };

  const handleApproveReject = (type: string) => async (event: any) => {
    // 이벤트 데이터 속성에서 username 가져오기
    const userId = event.currentTarget.getAttribute("data-username");
    if (!userId) return window.alert("사용자 id가 없습니다.");

    // 승인 처리 API 호출
    try {
      const result = await axios.put(`/auth/${userId}/${type}`);
      // API 호출 성공 시 사용자 목록 업데이트
      mutate();
      console.log(result);
    } catch (error) {
      console.error("Error approving user", error);
    }
  };

  // 표 컬럼 정의
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
            style={{ height: "2.1rem" }}
            size={"small"}
            onClick={handleApproveReject("approve")}
            data-username={el}
          >
            수락
          </Button>
          <Button
            className="hover:outline-black font-medium w-1/2 danger"
            block
            style={{ height: "2.1rem" }}
            size={"small"}
            danger
            onClick={handleApproveReject("Reject")}
            data-username={el}
          >
            거절
          </Button>
        </div>
      ),
    },
  ];

  // 표 컬럼 정의 (결제 내역)
  const paymentColumns = [
    {
      title: "판매자",
      dataIndex: "seller_name",
      key: "seller_name",
    },
    {
      title: "구매 곡 이름",
      dataIndex: "buyer_music_title",
      key: "buyer_name",
    },
    {
      title: "구매 제품 가격",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: (el: number) => (
        <p>{[el].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"}</p>
      ),
    },
    {
      title: "판매자 전화번호",
      dataIndex: "buyer_tel",
      key: "buyer_tel",
    },
    {
      title: "판매자 이메일",
      dataIndex: "buyer_email",
      key: "buyer_email",
    },
    {
      title: "구매 방식",
      dataIndex: "pg_provider",
      key: "pg_provider",
    },
    {
      title: "구매 성공여부",
      dataIndex: "success",
      key: "success",
      render: (el: boolean) => <p>{el ? "구매완료" : "실패"}</p>,
    },
    {
      title: "다운로드",
      dataIndex: "musicFileUrl",
      key: "musicFileUrl",
      render: (el: string) => (
        <Button onClick={handleDownload(el)}>다운로드</Button>
      ),
    },
  ];

  // 표 컬럼 정의 (판매 내역)
  const paymentColumns2 = [
    {
      title: "구매자",
      dataIndex: "buyername",
      key: "buyername",
    },
    {
      title: "판매 곡 이름",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "제품 가격",
      dataIndex: "price",
      key: "price",
      render: (el: number) => (
        <p>{[el].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"}</p>
      ),
    },
  ];

  // 탭 메뉴 정의
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "내가 쓴 글",
      children: (
        <div className="w-full section-layout">
          <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
            <TfiWrite className="mr-2" /> 내가 쓴 글
          </p>
          <div className={data.type !== "Post" ? "" : "layout2"}>
            {myPostListArry.length === 0 && (
              <>
                <div className="flex flex-col justify-center w-full">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  <p className="text-lg text-center text-gray-300">
                    데이터가 없습니다.
                  </p>
                </div>
              </>
            )}
            <div className="layout2 md:flex md:flex-col">
              {data.userData.map((data: any) => {
                if (data.type === "Post") {
                  const post: Post = data;
                  if (post) {
                    return (
                      <>
                        <PostCardList key={post.identifier} post={post} />
                      </>
                    );
                  }
                }
              })}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "내가 쓴 댓글",
      children: (
        <div className="w-full section-layout">
          <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
            <AiOutlineComment className="mr-2" /> 내가 쓴 댓글
          </p>
          {myCommentListArry.length === 0 && (
            <>
              <div className="flex flex-col justify-center w-full">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <p className="text-lg text-center text-gray-300">
                  데이터가 없습니다.
                </p>
              </div>
            </>
          )}
          {data.userData.map((data: any) => {
            if (data.type === "Comment") {
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
                        <span className="mr-1">command on</span>
                        <Link href={`/${comment.post?.url}`} legacyBehavior>
                          <a className="cusor-pointer font-semibold hover:underline mr-1">
                            {comment.post?.title}
                          </a>
                        </Link>
                        {comment.post?.subName && (
                          <>
                            <span>·</span>
                            <Link
                              href={`/u/${comment.post?.subName}`}
                              legacyBehavior
                            >
                              <a className="cusor-pointer font-semibold hover:underline">
                                /r/{comment.post?.subName}
                              </a>
                            </Link>
                          </>
                        )}
                      </p>
                      <hr />
                      <p className="p-1">{comment.body}</p>
                    </div>
                  </div>
                </>
              );
            }
          })}
        </div>
      ),
    },
    {
      key: "3",
      label: "맴버가입 신청 리스트",
      children: (
        <div className="w-full section-layout">
          <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
            <AiOutlineOrderedList className="mr-2" /> 맴버가입 신청 리스트
          </p>
          <BasicTable
            columns={columns}
            data={data.user.approvalRequsts}
            type={"user"}
          />
        </div>
      ),
    },
    {
      key: "4",
      label: "구매 곡 목록",
      children: (
        <div className="w-full section-layout">
          <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
            <AiOutlineOrderedList className="mr-2" /> 구매 곡 목록
          </p>

          <BasicTable columns={paymentColumns} data={userPayListArry} />
        </div>
      ),
    },
    {
      key: "5",
      label: "나의 곡 판매현황",
      children: (
        <div className="w-full section-layout">
          <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
            <AiOutlineOrderedList className="mr-2" /> 판매현황
          </p>
          <BasicTable
            columns={paymentColumns2}
            data={userSellingPostListArry}
            type={"user"}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className="max-w-5xl px-4 pt-5 mx-auto"
      style={{ minHeight: "calc(100vh - 243px)" }}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="w-full md:mr-3"
        tabPosition={"top"}
        type="card"
      />
    </div>
  );
}
