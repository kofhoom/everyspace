import PostCardList from "@/src/components/units/post/cardList/PostCardList.index";
import { Post } from "@/types";
import useSWR from "swr";
import { Divider, Empty } from "antd";
import { useState } from "react";
import axios from "axios";
import SearchBar from "@/src/components/commons/searchBar";
import CarouselList from "@/src/components/commons/slider";
import { useRouter } from "next/router";

export default function Home() {
  const [searchData, setSearchData] = useState("");

  const router = useRouter();

  const { data, error, mutate } = useSWR<Post[]>("/posts?count=3");
  const {
    data: popularityPost,
    error: getUserError,
    mutate: popularityMutate,
  } = useSWR<Post[]>("/posts/popularity");

  const [closeState, setCloseState] = useState(false);
  // 데이터 로딩 상태
  const isInitialLoading = !data && !popularityPost && !error && !getUserError;

  // 데이터 없음
  const isPopularData = popularityPost?.length === 0;
  const isNewData = data?.length === 0;

  // 전체보기
  const handlelAllViewPost = async () => {
    if (!data) return window.alert("데이터가 없습니다.");
    try {
      // 전체 데이터 요청

      const { data } = await axios.get("/posts/getAllPost");

      // 데이터 갱신
      mutate(data, false);
      setCloseState(true);
    } catch (error) {
      console.error("데이터 가져오기 실패", error);
    }
  };

  // 접기
  const handlelCloseViewPost = async () => {
    try {
      // 전체 데이터 요청

      const { data } = await axios.get("/posts?count=3");

      // 데이터 갱신
      mutate(data, false);
      setCloseState(false);
    } catch (error) {
      console.error("데이터 가져오기 실패", error);
    }
  };

  const handleSearch = async () => {
    if (!searchData) {
      window.alert("검색어를 입력해 주세요");
      return;
    }
    router.push(`/search?searchData=${searchData}`);
  };

  return (
    <main className="max-w-6xl px-4 mx-auto pt-5">
      <section className="w-full">
        <CarouselList />
      </section>
      <section className="w-full">
        <div className="mb-5 flex">
          <SearchBar
            setSearchData={setSearchData}
            handleSearch={handleSearch}
            name="SearchBar"
            type={"main"}
          />
        </div>
      </section>
      {/* 포스트 리스트 */}
      <section className="w-full section-layout">
        <div className="flex justify-between items-end">
          <h2 className="main-section-title">
            NEW 최신 음악.{" "}
            <span className="text-gray-500 text-xl">
              따끈따끈한 신곡을 확인해 보세요
            </span>
          </h2>
          <span
            className="cursor-pointer hover:underline transition"
            onClick={handlelAllViewPost}
          >
            전체보기
          </span>
        </div>
        <Divider className="mb-5 mt-2" />
        <div className={`w-full ${isNewData ? "" : "layout"}`}>
          {isInitialLoading && (
            <p className="text-lg text-center">로딩중입니다.</p>
          )}
          {isNewData && (
            <>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
              <p className="text-lg text-center text-gray-300">
                데이터가 없습니다.
              </p>
            </>
          )}
          {data?.map((post) => (
            <PostCardList key={post.identifier} post={post} mutate={mutate} />
          ))}
        </div>
        {/* 접기버튼 */}
        {closeState && (
          <p
            className="cursor-pointer w-full mx-0 p-2 my-2 text-center rounded-xl border border-gray-300 hover:border-black hover:font-semibold transition"
            onClick={handlelCloseViewPost}
          >
            접기
          </p>
        )}
      </section>
      <Divider className="" />
      <section className="w-full mt-10 section-layout">
        <h2 className="main-section-title">
          인기 음악.{" "}
          <span className="text-gray-500 text-xl">
            지금! 가장 인기있는 음악
          </span>
        </h2>
        <Divider className="mb-5 mt-2" />
        <div className={`w-full ${isPopularData ? "" : "layout"}`}>
          {isInitialLoading && (
            <p className="text-lg text-center">로딩중입니다.</p>
          )}
          {isPopularData && (
            <>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
              <p className="text-lg text-center text-gray-300">
                데이터가 없습니다.
              </p>
            </>
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
