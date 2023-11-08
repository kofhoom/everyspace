import PostCardList from "@/src/components/units/post/cardList/PostCardList.index";
import { Post } from "@/types";
import useSwR from "swr";
import { Divider, Empty } from "antd";
import { useRouter } from "next/router";

export default function SearchList() {
  const router = useRouter();
  const searchData = router.query.searchData;
  const { data, error, mutate } = useSwR<Post[]>(
    searchData ? `/search/${searchData}` : null
  );

  // 데이터 로딩 상태
  const isInitialLoading = !data && !error;

  // 데이터 없음
  const isEmtyData = data?.length === 0 || error;

  return (
    <main className="max-w-6xl px-4 mx-auto pt-5">
      {/* 포스트 리스트 */}
      <section className="w-full section-layout">
        <h2 className="main-section-title">
          {`"${searchData}"`}에 대한 검색결과 입니다.{" "}
          <p className="text-gray-500 text-xl mt-1">
            {data?.length}개의 게시물을 찾았습니다.
          </p>
        </h2>
        <Divider className="mb-5 mt-2" />
        <div className={`w-full ${isEmtyData ? "" : "layout"}`}>
          {isInitialLoading && (
            <p className="text-lg text-center">로딩중입니다.</p>
          )}
          {isEmtyData && (
            <>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
              <p className="text-lg text-center text-gray-300">
                검색결과가 없습니다.
              </p>
            </>
          )}
          {data?.map((post) => (
            <PostCardList
              key={post.identifier}
              post={post}
              mutate={mutate}
              keyWord={searchData}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
