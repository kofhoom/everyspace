import { Post } from "@/types";
import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Divider, Empty } from "antd";
import PostCardList from "@/src/components/units/post/cardList/PostCardList.index";
import CommunitySideBarList from "@/src/components/units/community/sideBar/CommunitySideBarList.index";

export default function CommunityList() {
  // useSWRInfinite 훅을 사용하여 무한 스크롤 기능을 구현하는 컴포넌트

  // 페이지별 데이터를 가져오기 위한 키를 생성하는 함수
  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  };

  // useSWRInfinite 훅을 사용하여 데이터를 가져오기
  const {
    data,
    error,
    size: page,
    setSize: setPage,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);

  // 초기 로딩 상태 확인
  const isInitialLoading = !data && !error;

  // 전체 포스트 데이터 추출
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  // 무한 스크롤을 위한 관찰 대상 포스트 식별자 상태
  const [observePost, setObservedPost] = useState("");

  useEffect(() => {
    // 포스트가 없다면 return
    if (!posts || posts.length === 0) return;

    // posts 배열안에 마지막 post에 id를 가져옵니다.
    const id = posts[posts.length - 1].identifier;

    // posts 배열에 post가 추가돼서 마지막 post가 바뀌었다면
    // 바뀐 post 중 마지막post를 observePost로 설정
    if (id !== observePost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  // IntersectionObserver를 사용하여 요소 관찰
  const observeElement = (el: HTMLElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      // entries는 IntersectionObserverEntry 인스턴스의 배열
      (entries) => {
        // isIntersecting: 관찰 대상의 교차 상태(Boolean)
        if (entries[0].isIntersecting === true) {
          console.log("마지막 포스트에 도달했습니다.");
          setPage(page + 1);
          observer.unobserve(el);
        }
      },
      { threshold: 1 }
    );

    // 대상 요소의 관찰을 시작
    observer.observe(el);
  };

  // 현재 경로를 가져오기
  const { pathname } = useRouter();

  // 인증이 필요한 경로 목록
  const authRoutes = ["/community"];

  // 현재 경로가 인증이 필요한 경로인지 확인
  const authRoute = authRoutes.includes(pathname);

  // 포스트 데이터가 없는지 확인
  const isPostsData = posts.filter((el) => el.sub !== null).length === 0;

  return (
    <main
      className="flex max-w-6xl px-4 mx-auto pt-5 ms:flex-col"
      style={{ minHeight: "calc(100vh - 243px)" }}
    >
      {/* 포스트 리스트 */}
      <div className="w-full section-layout border shadow-md ms:order-2">
        <div className="w-full">
          <h2 className="main-section-title ">아지트 전체글 </h2>
          <Divider className="mb-5 mt-2" />
        </div>

        {/* 초기 로딩 중인 경우 로딩 메시지 표시 */}
        {isInitialLoading && (
          <p className="text-lg text-center">로딩중입니다.</p>
        )}

        {/* 데이터가 없는 경우 또는 서브네임이 null인 경우 표시 */}
        {isPostsData ? (
          <>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
            <p className="text-lg text-center text-gray-300">
              데이터가 없습니다.
            </p>
          </>
        ) : (
          ""
        )}
        <div className="w-full layout2 ml:flex flex-col">
          {/* 포스트 카드 리스트 표시 */}
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
