import PostCardList from "@/src/components/units/post/cardList/PostCardList.index";
import { Post } from "@/types";
import useSWR from "swr";
import useSwR from "swr";
import { Divider } from "antd";

export default function Home() {
  // 포스트 리스트 가져오기
  const address = `/posts?count=3`;
  const { data, error, mutate } = useSWR<Post[]>(address);
  const {
    data: popularityPost,
    error: getUserError,
    mutate: popularityMutate,
  } = useSwR<Post[]>("/posts/popularity");

  // 데이터 로딩 상태
  const isInitialLoading = !data && !popularityPost && !error && !getUserError;

  return (
    <main className="max-w-6xl px-4 mx-auto pt-5">
      {/* 포스트 리스트 */}
      <section className="w-full">
        <h2 className="main-section-title">
          NEW 최신 음악.{" "}
          <span className="text-gray-500 text-xl">따끈따끈한 신곡</span>
        </h2>
        <Divider className="mb-5 mt-2" />
        <div className="w-full layout">
          {isInitialLoading && (
            <p className="text-lg text-center">로딩중입니다.</p>
          )}
          {data?.map((post) => (
            <PostCardList key={post.identifier} post={post} mutate={mutate} />
          ))}
        </div>
      </section>
      <section className="w-full mt-10">
        <h2 className="main-section-title">
          인기 음악.{" "}
          <span className="text-gray-500 text-xl">
            지금! 가장 인기있는 음악
          </span>
        </h2>
        <Divider className="mb-5 mt-2" />
        <div className="w-full layout">
          {isInitialLoading && (
            <p className="text-lg text-center">로딩중입니다.</p>
          )}
          {popularityPost?.map((post) => (
            <PostCardList
              key={post.identifier}
              post={post}
              mutate={popularityMutate}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
