import PostCardList from "@/src/components/units/post/cardList/PostCardList.index";
import { Post, Sub } from "@/types";
import useSWR from "swr";
import { Divider, Empty } from "antd";
import { useState } from "react";
import axios from "axios";
import SearchBar from "@/src/components/commons/searchBar";
import CarouselList from "@/src/components/commons/slider";
import { useRouter } from "next/router";
import Link from "next/link";
import AgitList from "@/src/components/units/agit/AgitList.index";
import CatagoryList from "@/src/components/units/category/CatagoryList.index";

export default function Home() {
  const [searchData, setSearchData] = useState("");
  const [closeState, setCloseState] = useState({
    post: false,
    sub: false,
  });

  const { data, error, mutate } = useSWR<Post[]>("/posts?count=3"); // 포스트 리스트
  console.log(data);
  const {
    data: subData,
    error: subError,
    mutate: subMutate,
  } = useSWR<Sub[]>("/boards/getSubs?count=3"); //아지트 리스트

  const {
    data: popularityPost,
    error: getUserError,
    mutate: popularityMutate,
  } = useSWR<Post[]>("/posts/popularity"); // 최신 인기순

  const router = useRouter();

  // 데이터 로딩 상태
  const isInitialLoading =
    !data &&
    !popularityPost &&
    !subData &&
    !error &&
    !getUserError &&
    !subError;

  // 데이터 없음
  const isPopularData = popularityPost?.length === 0;
  const isNewData = data?.length === 0;
  const issSubData = subData?.length === 0;

  // 전체보기
  const handlelAllViewPost =
    (address: string, state: boolean) => async (event: any) => {
      if (!data) return window.alert("데이터가 없습니다.");

      const { id } = event.currentTarget;
      try {
        // 전체 데이터 요청
        const { data } = await axios.get(address);

        // 데이터 갱신
        if (id == "post") {
          mutate(data, false);
        }

        if (id == "sub") {
          subMutate(data, false);
        }

        setCloseState((prevData) => ({ ...prevData, [id]: state }));
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
      <section className="w-full section-layout px-0">
        <div className="flex justify-between items-end sm:flex-col sm:items-start">
          <h2 className="main-section-title sm:flex sm:flex-col">
            NEW 최신 음악.{" "}
            <span className="text-gray-400 text-base font-normal">
              따끈따끈한 신곡을 확인해 보세요
            </span>
          </h2>
          <span
            id="post"
            className="cursor-pointer hover:underline transition sm:ml-auto"
            onClick={handlelAllViewPost("/posts/getAllPost", true)}
          >
            전체보기
          </span>
        </div>
        <Divider className="mb-5 mt-2" />
        <div className={`w-full ${isNewData ? "" : "layout md:flex flex-col"}`}>
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
        {closeState.post && (
          <p
            id="post"
            className="cursor-pointer w-full mx-0 p-2 my-2 text-center rounded-xl border border-gray-300 hover:border-black hover:font-semibold transition"
            onClick={handlelAllViewPost("/posts?count=3", false)}
          >
            접기
          </p>
        )}
      </section>
      <Divider className="" />
      {/* 인기음악 */}
      <section className="w-full mt-10 section-layout px-0">
        <h2 className="main-section-title sm:flex sm:flex-col">
          인기 음악.{" "}
          <span className="text-gray-400 text-base font-normal">
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
      <Divider className="mb-5 mt-2" />
      {/* 장르별 음악 */}
      <section className="w-full mt-10 section-layout px-0">
        {" "}
        <div className="flex justify-between items-end">
          <h2 className="main-section-title sm:flex sm:flex-col">
            장르별 음악.{" "}
            <span className="text-gray-400 text-base font-normal">
              내 취향에 맞는 음악장르를 확인해 보세요
            </span>
          </h2>
        </div>
        <Divider className="mb-5 mt-2" />
        <div className="w-full">
          <CatagoryList />
        </div>
      </section>
      <Divider className="mb-5 mt-2" />
      <section className="w-full mt-10 section-layout px-0">
        <div className="flex justify-between items-end sm:flex-col sm:items-start">
          <h2 className="main-section-title sm:flex sm:flex-col">
            NEW 아지트.{" "}
            <span className="text-gray-400 text-base font-normal">
              내 취향에 맞는 신규 아지트에 가입 하세요
            </span>
          </h2>
          <span
            id="sub"
            className="cursor-pointer hover:underline transition sm:ml-auto"
            onClick={handlelAllViewPost("/boards", true)}
          >
            전체보기
          </span>
        </div>
        <Divider className="mb-5 mt-2" />
        <div
          className={`w-full ${issSubData ? "" : "layout md:flex flex-col"}`}
        >
          {isInitialLoading && (
            <p className="text-lg text-center">로딩중입니다.</p>
          )}
          {issSubData && (
            <>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
              <p className="text-lg text-center text-gray-300">
                데이터가 없습니다.
              </p>
            </>
          )}

          {subData?.map((sub: Sub) => (
            <AgitList key={sub.id} data={sub} />
          ))}
        </div>
        {/* 접기버튼 */}
        {closeState.sub && (
          <p
            id="sub"
            className="cursor-pointer w-full mx-0 p-2 my-2 text-center rounded-xl border border-gray-300 hover:border-black hover:font-semibold transition"
            onClick={handlelAllViewPost("/boards/getSubs?count=3", false)}
          >
            접기
          </p>
        )}
      </section>
      <Divider className="mb-5 mt-2" />
      {/* 마지막 섹션 */}
      <section className="w-full h-96 flex justify-center items-center flex-col">
        <div className="w-full text-center">
          <p className="text-4xl mb-2 sm:text-2xl break-keep">
            들어 주셔서 감사합니다. 이제 참여하세요.
          </p>
          <p className="sm:text-sm break-keep">
            트랙을 확인하고, 아티스트를 서포트하고, 원하는 음악을 가지세요.
          </p>
        </div>
        <div className="cursor-pointer mt-6 text-center mb-5">
          <button className="w-32 px-2 h-12 text-center text-black font-normal border-gray-300 hover:border-blue-500 hover:text-blue-500 transition rounded-3xl border bg-white">
            <Link href={`/register`} legacyBehavior>
              <a className="flex justify-center items-center w-full h-full text-lg">
                계정 만들기
              </a>
            </Link>
          </button>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-xs mr-1" style={{ color: "#333" }}>
            이미 계정이 있나요?
          </p>
          <div className="h-10 text-center text-blue-400 font-normal  hover:border-blue-500 hover:text-blue-500 transition bg-white">
            <Link href={`/login`} legacyBehavior>
              <a className="flex justify-center items-center w-full h-full text-xs">
                로그인
              </a>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
