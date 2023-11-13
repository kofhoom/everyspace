import { Post } from "@/types";
import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import axios from "axios";
import { Divider, Empty } from "antd";
import PostCardList from "@/src/components/units/post/cardList/PostCardList.index";
import CommunitySideBarList from "@/src/components/units/community/sideBar/CommunitySideBarList.index";

export default function Home() {
  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  };
  const {
    data,
    error,
    size: page,
    setSize: setPage,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];
  const isPostsData = posts?.length === 0;

  const [observePost, setObservedPost] = useState("");

  useEffect(() => {
    // 포스트가 없다면 return
    if (!posts || posts.length === 0) return;
    // posts 배열안에 마지막 post에 id를 가져옵니다.
    const id = posts[posts.length - 1].identifier;
    // posts 배열에 post가 추가돼서 마지막 post가 바뀌었다면
    // 바뀐 post 중 마지막post를 observePost로
    if (id !== observePost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const observeElement = (el: HTMLElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      // entries는 IntersectionObserverEntry 인스턴스의 배열
      (entries) => {
        // isIntersecting: 관찰 대상의 교차 상태(Boolean)
        if (entries[0].isIntersecting == true) {
          // console.log("마지막 포스트에 왔습니다.");
          setPage(page + 1);
          observer.unobserve(el);
        }
      },
      { threshold: 1 }
    );
    // 대상 요소의 관찰을 시작
    observer.observe(el);
  };

  const { pathname } = useRouter();
  const authRoutes = ["/community"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <main className="flex max-w-6xl px-4 mx-auto pt-5">
      {/* 포스트 리스트 */}
      <div className="w-full section-layout border shadow-md">
        <div className="w-full">
          <h2 className="main-section-title ">아지트 전체글 </h2>
          <Divider className="mb-5 mt-2" />
        </div>
        {isInitialLoading && (
          <p className="text-lg text-center">로딩중입니다.</p>
        )}
        {isPostsData || posts[0]?.subName === null ? (
          <>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
            <p className="text-lg text-center text-gray-300">
              데이터가 없습니다.
            </p>
          </>
        ) : (
          ""
        )}
        <div className="w-full layout2">
          {posts?.map(
            (post) =>
              post.subName !== null && (
                <PostCardList
                  key={post.identifier}
                  post={post}
                  mutate={mutate}
                />
              )
          )}
        </div>
      </div>
      {/* 커뮤니티 리스트 */}
      {authRoute && <CommunitySideBarList />}
    </main>
  );
}

// 인증에 따른 제한
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키가 없다면 에러를 보내기
    if (!cookie) throw Error("Missing auth token cookie");

    // 쿠키가 있다면 그 쿠키를 이용해서 백엔드에 인증 처리하기
    await axios.get("/auth/me", { headers: { cookie } });
    return { props: {} };
  } catch (error) {
    // 백엔드에서 요청에서 던져준 쿠기를 이용해 인증 처리할 떄 에러가 나면 /login 페이지로 이동
    res.writeHead(307, { Location: "../login" }).end();
    return { props: {} };
  }
};
